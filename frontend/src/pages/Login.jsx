import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Solo personal autorizado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-white transition-all group">
         <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
         <span className="text-[10px] font-black uppercase tracking-widest italic">Volver a la Tienda</span>
      </Link>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-2xl shadow-primary/20">
              <Lock size={30} />
           </div>
           <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Login</h1>
           <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] italic">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
           <div className="glass rounded-[32px] p-8 border border-white/5 space-y-6 bg-black/40 backdrop-blur-xl">
              
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Email</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@rapboys.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold outline-none focus:border-primary/50 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold outline-none focus:border-primary/50 transition-all"
                    />
                 </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                   <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar'}
              </button>
           </div>
        </form>

        <p className="text-center mt-10 text-white/10 text-[8px] font-black uppercase tracking-[0.3em]">
           Sistema de Gestión RapBoys v2.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
