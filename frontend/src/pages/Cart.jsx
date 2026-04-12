import { useState, useEffect } from 'react';
import { useCart } from '../App';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Mail, X, Smartphone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi, settingsApi } from '../services/api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  
  // Estado para el QR dinámico
  const [paymentQr, setPaymentQr] = useState('/assets/yape_qr.png');
  const [loadingQr, setLoadingQr] = useState(true);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const res = await settingsApi.get('yape_qr');
      if (res.data && res.data.image) {
        setPaymentQr(res.data.image);
      }
    } catch (err) {
      console.log("Usando QR por defecto.");
    } finally {
      setLoadingQr(false);
    }
  };

  const handleStartVerification = async (e) => {
    e.preventDefault();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    try {
      await ordersApi.sendOtp({
        email: formData.email,
        otp_code: newOtp,
        full_name: formData.firstName
      });
      setStep(3);
    } catch (err) {
      alert("Error al enviar el correo. Por favor intenta de nuevo.");
    }
  };

  const verifyOTP = async () => {
    if (otp === generatedOtp) {
      try {
        const orderData = {
          full_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          total_price: totalPrice,
          items: cart.map(item => ({ product: item.id, quantity: item.quantity, price: item.price })),
          otp_code_sent: generatedOtp,
          otp_code_entered: otp,
          status: 'pendiente'
        };
        const res = await ordersApi.create(orderData);
        const newOrderId = res.data.id;
        setOrderId(newOrderId.toString());
        
        try {
            await ordersApi.sendConfirmation({
                email: formData.email,
                order_id: newOrderId.toString(),
                full_name: formData.firstName
            });
        } catch (e) {
            console.error("No se pudo enviar el correo de confirmación.");
        }

        setStep(4);
        clearCart();
      } catch (err) {
        alert("Error al procesar el pedido.");
      }
    } else {
      alert("❌ Código incorrecto.");
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 text-primary shadow-2xl shadow-primary/20">
            <Mail size={48} className="animate-bounce" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">¡Pedido Listo!</h1>
        <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-xs mb-12 max-w-md">
            Hemos enviado tu <span className="text-primary italic">Código de Barras</span> a tu correo. Muéstralo en tienda para recoger tu pedido.
        </p>
        
        <div className="glass rounded-[56px] p-12 border border-white/10 mb-12 w-full max-w-lg bg-black/40 backdrop-blur-3xl shadow-2xl">
           <div className="space-y-8">
              <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-primary/10 rounded-2xl mb-2 text-primary">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic">Correo de Confirmación</h3>
                  <p className="text-sm font-bold opacity-40">{formData.email}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="p-6 bg-white/5 rounded-[32px] text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Pasos a seguir</p>
                    <p className="text-xs font-bold leading-relaxed opacity-70 italic font-medium">1. Abre el correo de RapBoys.<br/>2. Busca tu código de barras.<br/>3. Ven a nuestra sucursal.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[32px] text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Dirección</p>
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-1 text-primary shrink-0" />
                        <p className="text-xs font-bold leading-relaxed opacity-70 italic font-black uppercase">Jr. Unión 271, Trujillo - Perú</p>
                    </div>
                </div>
              </div>
           </div>
        </div>

        <Link to="/" className="text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-all">Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen relative">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-grow">
          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-left duration-500">
               <h1 className="text-5xl font-black italic uppercase tracking-tighter border-b border-white/10 pb-6">Carrito</h1>
               {cart.length === 0 ? (
                 <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20"><ShoppingBag size={40}/></div>
                    <p className="text-white/20 font-black uppercase tracking-widest text-xs">Tu carrito está vacío</p>
                    <Link to="/" className="inline-block border border-white/10 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Ir a la tienda</Link>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="glass rounded-[32px] p-5 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5">
                                {item.image ? <img src={item.image} className="w-full h-full object-cover" alt=""/> : <ShoppingBag size={20} className="mx-auto mt-4 opacity-10"/>}
                            </div>
                            <div>
                                <h3 className="font-black italic uppercase text-xs">{item.name}</h3>
                                <p className="text-[10px] font-bold text-white/20">S/ {parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors cursor-pointer"><Minus size={14}/></button>
                                    <span className="text-xs font-black">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors cursor-pointer"><Plus size={14}/></button>
                                    <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500/40 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14}/></button>
                                </div>
                            </div>
                         </div>
                         <p className="text-primary font-black italic">S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
               <h1 className="text-5xl font-black italic uppercase tracking-tighter">Información</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="glass rounded-[48px] p-10 border border-white/5 flex flex-col items-center justify-center bg-black/40 shadow-inner">
                     <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-6 italic">Escanea y Paga</p>
                     
                     {/* QR DINÁMICO DESDE AJUSTES */}
                     <div className="w-full max-w-[240px] aspect-square bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden p-4">
                        {loadingQr ? (
                            <Loader2 className="animate-spin text-primary" size={24} />
                        ) : (
                            <img src={paymentQr} className="w-full h-full object-contain" alt="QR Pago" />
                        )}
                     </div>

                     <div className="mt-8 text-center"><p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 font-sans">Monto a pagar</p><p className="text-4xl font-black text-white italic">S/ {totalPrice.toFixed(2)}</p></div>
                  </div>

                  <form onSubmit={handleStartVerification} className="space-y-5 flex flex-col justify-center">
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="Nombre" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary/50"/>
                        <input type="text" required placeholder="Apellido" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary/50"/>
                    </div>
                     <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18}/><input type="email" required placeholder="tu@correo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary/50"/></div>
                     <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18}/>
                        <input type="tel" required placeholder="Celular (Obligatorio)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary/50"/>
                    </div>
                     <button type="submit" className="w-full bg-primary py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] mt-6 cursor-pointer hover:scale-105 transition-all shadow-xl shadow-primary/20">Continuar Verificación</button>
                  </form>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center max-w-lg mx-auto py-20 space-y-10 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 animate-bounce"><ShieldCheck size={40} /></div>
               <div className="space-y-2"><h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Revisa tu Mail</h1><p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Código enviado a: <span className="text-white">{formData.email}</span></p></div>
               <div className="space-y-6">
                  <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="0 0 0 0 0 0" className="w-full bg-white/5 border-2 border-white/10 rounded-[32px] py-6 text-4xl font-black text-center tracking-[0.4em] focus:border-primary transition-all outline-none italic"/>
                  <button onClick={verifyOTP} className="w-full bg-primary py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] cursor-pointer hover:scale-105 transition-all shadow-xl shadow-primary/20">Validar y Completar Compra</button>
               </div>
            </div>
          )}
        </div>

        {step === 1 && cart.length > 0 && (
           <div className="w-full lg:w-[350px] shrink-0">
              <div className="glass rounded-[48px] p-8 border border-white/10 sticky top-32 shadow-2xl bg-black/40">
                 <h2 className="text-lg font-black italic uppercase tracking-tighter mb-6 border-b border-white/5 pb-4 opacity-40 italic font-medium">Resumen</h2>
                 <div className="flex justify-between items-end mb-8"><p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Total</p><p className="text-4xl font-black italic text-primary leading-none tracking-tighter">S/ {totalPrice.toFixed(2)}</p></div>
                 <button onClick={() => setStep(2)} className="w-full bg-primary text-black py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-all shadow-xl shadow-primary/20">Pagar ahora <ArrowRight size={18}/></button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
