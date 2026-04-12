import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, LogOut, TrendingUp, Users, WalletMinimal, Settings } from 'lucide-react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import { ordersApi } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Resumen', path: '/admin-dashboard' },
    { icon: <ShoppingBag size={20} />, label: 'Productos', path: '/admin-dashboard/products' },
    { icon: <ClipboardList size={20} />, label: 'Pedidos', path: '/admin-dashboard/orders' },
    { icon: <Settings size={20} />, label: 'Ajustes', path: '/admin-dashboard/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      <aside className="w-64 glass border-r border-white/5 p-6 flex flex-col fixed h-full z-[50]">
        <div className="mb-10 pl-2">
          <h2 className="text-xl font-black italic tracking-tighter">RAPBOYS<span className="text-primary text-xs not-italic ml-1 font-bold">ADMIN</span></h2>
        </div>
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{item.icon} {item.label}</Link>
          ))}
        </nav>
        <div className="pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-white/40 hover:text-red-400 transition-colors font-bold text-sm w-full outline-none"><LogOut size={20} /> Salir</button>
        </div>
      </aside>
      <main className="flex-grow ml-64 p-10 bg-[#050505]">
        <Routes>
          <Route path="/" element={<AdminStats />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminStats = () => {
  const [stats, setStats] = useState({ total_sales: 0, total_profit: 0, new_orders: 0, total_clients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ordersApi.getStats();
        setStats(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Ingresos Totales', value: `S/ ${stats.total_sales.toFixed(2)}`, accent: 'text-white', icon: <TrendingUp className="text-white" /> },
    { label: 'Utilidad / Ganancia', value: `S/ ${stats.total_profit.toFixed(2)}`, accent: 'text-green-500', icon: <WalletMinimal className="text-green-500" /> },
    { label: 'Pedidos Pendientes', value: stats.new_orders.toString(), accent: 'text-primary', icon: <ClipboardList className="text-primary" /> },
    { label: 'Clientes Reales', value: stats.total_clients.toString(), accent: 'text-blue-500', icon: <Users className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black italic uppercase tracking-tighter">Finanzas RapBoys</h1><div className="text-white/20 text-[10px] uppercase font-bold tracking-widest italic">{loading ? 'Cargando...' : `Sync: ${new Date().toLocaleTimeString()}`}</div></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="glass p-6 rounded-[32px] border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
             <div className="flex justify-between items-start mb-4"><div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">{card.icon}</div></div>
             <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{card.label}</p>
             <p className={`text-2xl font-black italic ${card.accent}`}>{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-[40px] p-8 border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Monitor Financiero</h2>
        <p className="text-white/40 text-xs">Las ganancias se calculan restando el precio de costo a cada venta verificada.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
