import { useState } from 'react';
import { ShieldCheck, Phone, Mail, User, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    otp_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of API call
    setTimeout(() => {
      setStep(2);
      setLoading(false);
      setMessage({ type: 'success', text: 'Código OTP enviado al teléfono.' });
    }, 1500);
  };

  const verifyOTPAndCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of verification and creation
    setTimeout(() => {
      setStep(3);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="flex items-center justify-center gap-10 mb-16">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step >= s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/30'
            }`}>
              {step > s ? <CheckCircle2 size={18} /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-[2px] rounded-full ${step > s ? 'bg-primary' : 'bg-white/5'}`} />}
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
        {step === 1 && (
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
               <User className="text-primary" /> DATOS DEL CLIENTE
            </h2>
            <form onSubmit={requestOTP} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" name="full_name" required value={formData.full_name} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Número de Teléfono (Perú)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="tel" name="phone" required pattern="9[0-9]{8}" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-xl font-bold tracking-widest"
                      placeholder="9XXXXXXXX"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 pl-1">Enviaremos un código SMS para verificar tu identidad y prevenir fraudes.</p>
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 mt-8 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {loading ? 'ENVIANDO...' : 'SOLICITAR CÓDIGO VERIFICACIÓN'} <ChevronRight size={20} />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="text-primary" size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4 uppercase">Verifica tu teléfono</h2>
            <p className="text-white/50 mb-10">Ingresa el código de 6 dígitos que enviamos al <br /><span className="text-white font-bold tracking-widest">+51 {formData.phone}</span></p>
            
            <form onSubmit={verifyOTPAndCreateOrder} className="max-w-xs mx-auto space-y-8">
              <input 
                type="text" maxLength="6" required value={formData.otp_code} name="otp_code" onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-2xl py-6 text-center text-5xl font-black tracking-[0.4em] outline-none transition-all"
                placeholder="000000"
              />
              <div className="space-y-4">
                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? 'VERIFICANDO...' : 'CONFIRMAR PEDIDO'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="text-white/30 text-xs font-bold flex items-center justify-center gap-2 w-full hover:text-white transition-colors">
                  <ArrowLeft size={14} /> CORREGIR DATOS
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10">
              <CheckCircle2 className="text-green-500" size={50} />
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase">¡PEDIDO CREADO!</h2>
            <p className="text-white/50 mb-12">Tu pedido <span className="text-primary font-bold">#RB-8921</span> ha sido generado con éxito.</p>
            
            <div className="bg-white/5 rounded-3xl p-10 mb-12 border border-white/5">
              <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-primary">Pagar con Yape</h3>
              <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-2xl">
                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YAPE_PAYMENT_RAPBOYS" alt="Yape QR" className="w-full h-full" />
                </div>
                <div className="text-left space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Monto a pagar</p>
                    <p className="text-4xl font-black text-white">S/ 45.00</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Nombre Titular</p>
                    <p className="text-lg font-bold text-white">RapBoys Barber Shop</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-white/40">Sube una captura de tu comprobante para validar tu pedido.</p>
              <label className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-5 rounded-2xl font-bold cursor-pointer transition-all">
                SUBIR COMPROBANTE DE YAPE
                <input type="file" className="hidden" />
              </label>
              <p className="text-[10px] text-white/20 uppercase tracking-widest">El pedido expirará en 12 horas si no se registra el pago.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
