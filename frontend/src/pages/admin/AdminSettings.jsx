import { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle2, AlertCircle, Loader2, Smartphone, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { settingsApi } from '../../services/api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [yapeQr, setYapeQr] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.get('yape_qr');
      if (res.data && res.data.image) {
        setPreviewUrl(res.data.image);
      }
    } catch (err) {
      console.log("Setting yape_qr no encontrado o servidor no disponible.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setYapeQr(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!yapeQr && !previewUrl) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('key', 'yape_qr');
    if (yapeQr) formData.append('image', yapeQr);

    try {
      try {
        await settingsApi.update('yape_qr', formData);
      } catch (err) {
        // Si no existe, lo creamos
        if (err.response?.status === 404) {
          await settingsApi.create(formData);
        } else {
          throw err;
        }
      }
      setMessage({ type: 'success', text: '¡Ajustes guardados correctamente!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al conectar con el servidor.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-black italic uppercase tracking-tighter">Ajustes del Negocio</h1>
           <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1 italic">Configura tu QR de Pago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* QR de Pago */}
         <div className="lg:col-span-2 glass rounded-[40px] p-10 border border-white/5 bg-black/40 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/20 rounded-2xl text-primary font-black">
                        <Smartphone size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Gestionar QR de Yape</h2>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="flex flex-col items-center">
                        <div className="w-72 h-72 bg-black/60 rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group transition-all hover:border-primary/50 cursor-pointer">
                            {previewUrl ? (
                                <img src={previewUrl} className="w-full h-full object-contain p-4" alt="Preview QR" />
                            ) : (
                                <div className="text-center opacity-20">
                                    <ImageIcon size={48} className="mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase">Subir Imagen QR</p>
                                </div>
                            )}
                            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-white/20 mt-6 tracking-widest italic">Haz clic en el recuadro para cambiar la imagen</p>
                    </div>

                    <div className="max-w-xs mx-auto pt-4">
                        <button type="submit" disabled={saving} className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all disabled:opacity-50 cursor-pointer">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-2xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300 max-w-sm mx-auto ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
                        </div>
                    )}
                </form>
            </div>
         </div>

         {/* Info Sidebar */}
         <div className="space-y-6">
            <div className="glass rounded-[40px] p-8 border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 italic">¿Cómo funciona?</h3>
                <p className="text-xs font-bold leading-relaxed text-white/40 italic">La imagen que subas aquí será la que vean los clientes al momento de pagar en la tienda web. Asegúrate de que el QR se vea nítido.</p>
            </div>
            
            <div className="glass rounded-[40px] p-8 border border-white/5 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3 text-primary mb-4 italic">
                    <ShieldCheck size={20} />
                    <h2 className="text-[10px] font-black uppercase tracking-widest">Estado Seguro</h2>
                </div>
                <p className="text-xs font-bold leading-relaxed text-white/50 italic">Tu configuración está protegida por encriptación de extremo a extremo.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
