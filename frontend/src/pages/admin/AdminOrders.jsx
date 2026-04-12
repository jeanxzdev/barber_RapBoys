import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, Clock, Truck, XCircle, Loader2, Phone, Mail, User, ShieldAlert, Save, Image as ImageIcon, ShoppingBag, Smartphone, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ordersApi } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [obsText, setObsText] = useState('');
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => { fetchData(); }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage };
      const res = await ordersApi.getAll(params);
      
      if (res.data?.results) {
        setOrders(res.data.results);
        setTotalCount(res.data.count || 0);
        setTotalPages(Math.ceil((res.data.count || 0) / 8) || 1);
      } else {
        setOrders(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await ordersApi.update(id, { status: newStatus });
      fetchData();
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (err) { alert("Error"); }
  };

  const getStatusBadge = (status) => {
    const configs = {
      'pendiente': { label: 'PND', color: 'text-yellow-500 bg-yellow-500/10', icon: <Clock size={10}/> },
      'verificado': { label: 'VRF', color: 'text-green-500 bg-green-500/10', icon: <CheckCircle2 size={10}/> },
      'entregado': { label: 'ENT', color: 'text-blue-500 bg-blue-500/10', icon: <Truck size={10}/> },
      'cancelado': { label: 'CAN', color: 'text-red-500 bg-red-500/10', icon: <XCircle size={10}/> },
    };
    const c = configs[status] || configs['pendiente'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase italic ${c.color} border border-white/5`}>
        {c.icon} {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 max-h-screen overflow-hidden px-2 py-1">
      <div className="flex justify-between items-center bg-white/5 p-3 rounded-[20px] border border-white/5 shadow-xl">
        <h2 className="text-lg font-black italic uppercase tracking-tighter shrink-0 leading-none">Logística de Pedidos</h2>
        <div className="flex-grow max-w-sm mx-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar ID o Nombre..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold outline-none font-sans"/>
        </div>
        <p className="text-[9px] font-black opacity-20 uppercase tracking-widest shrink-0">{totalCount} envíos</p>
      </div>

      <div className="glass rounded-[28px] overflow-hidden border border-white/5 shadow-2xl bg-black/20">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
            <tr>
              <th className="px-6 py-3 italic">Código</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3 text-primary">Teléfono</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
                <tr><td colSpan="6" className="py-20 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={32} /></td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="py-20 text-center opacity-20 font-black uppercase text-[10px] tracking-widest italic">No hay pedidos registrados</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/[0.03] group transition-all">
                <td className="px-6 py-2.5 font-black text-white/60 tracking-tighter italic text-[11px]">#RB-{o.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-2.5"><div className="font-bold text-xs leading-none mb-1 text-white/90">{o.full_name}</div><div className="text-[8px] opacity-30 uppercase tracking-widest truncate max-w-[150px]">{o.email}</div></td>
                <td className="px-6 py-2.5 font-bold text-primary text-[10px] items-center gap-1"><span className="text-[9px] opacity-20 uppercase mr-1">Telf:</span>{o.phone || '---'}</td>
                <td className="px-6 py-2.5 font-black italic text-white leading-none text-xs">S/ {o.total_price}</td>
                <td className="px-6 py-2.5">{getStatusBadge(o.status)}</td>
                <td className="px-6 py-2.5 text-right">
                  <button onClick={() => { setSelectedOrder(o); setObsText(o.observation || ''); }} className="p-1.5 bg-white/5 hover:bg-primary hover:text-white rounded-lg transition-all">
                      <Eye size={14}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN COMPACTA */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Página <span className="text-primary italic">{currentPage}</span> / {totalPages}</p>
            <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 glass rounded-lg hover:bg-primary hover:text-white border border-white/5 transition-all disabled:opacity-10 cursor-pointer"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 glass rounded-lg hover:bg-primary hover:text-white border border-white/5 transition-all disabled:opacity-10 cursor-pointer"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative glass w-full max-w-2xl rounded-[40px] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-200 bg-black/80">
             
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1 text-primary">Detalle Pedido</h2>
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Guía: #RB-{selectedOrder.id.toString().padStart(4, '0')}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-white/20 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"><X size={28}/></button>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Información del Cliente</p>
                        <p className="text-sm font-black italic uppercase text-white">{selectedOrder.full_name}</p>
                        <p className="text-xs font-bold text-primary mt-1">{selectedOrder.phone}</p>
                        <p className="text-[10px] font-bold text-white/40 mt-1">{selectedOrder.email}</p>
                    </div>
                    {/* Seguridad OTP */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex justify-between items-center">
                       <div className="flex items-center gap-3 text-primary"><ShieldAlert size={16}/><p className="text-[9px] font-black uppercase tracking-widest leading-none">Validación OTP</p></div>
                       <div className="flex gap-4">
                          <div className="text-center"><p className="text-[7px] font-black opacity-20 uppercase mb-1 font-sans">Enviado</p><p className="font-black text-base tracking-widest">{selectedOrder.otp_code_sent || '---'}</p></div>
                          <div className="text-center border-l border-white/5 pl-4"><p className="text-[7px] font-black opacity-20 uppercase mb-1 font-sans">Confirmado</p><p className={`font-black text-base tracking-widest ${selectedOrder.otp_code_sent === selectedOrder.otp_code_entered ? 'text-green-500' : 'text-red-500'}`}>{selectedOrder.otp_code_entered || '---'}</p></div>
                       </div>
                    </div>
                </div>

                <div className="flex-grow space-y-3">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2 mb-2">
                     <ShoppingBag size={12} className="text-primary"/> Items de Compra
                   </p>
                   <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedProductItems(selectedOrder.items)
                      ) : (
                        <p className="text-[10px] italic opacity-20">Sin productos</p>
                      )}
                   </div>
                   <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                      <p className="text-[9px] font-black uppercase text-white/30 tracking-widest font-sans">Total</p>
                      <p className="text-2xl font-black italic text-primary leading-none">S/ {selectedOrder.total_price}</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-4">Estado Logístico</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => updateStatus(selectedOrder.id, 'pendiente')} className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 py-3 rounded-xl text-[9px] font-black uppercase transition-all italic">Pnd</button>
                        <button onClick={() => updateStatus(selectedOrder.id, 'verificado')} className="bg-green-600 text-white shadow-lg py-3 rounded-xl text-[9px] font-black uppercase transition-all italic">Vrf</button>
                        <button onClick={() => updateStatus(selectedOrder.id, 'entregado')} className="bg-blue-600 text-white shadow-lg py-3 rounded-xl text-[9px] font-black uppercase transition-all italic">Ent</button>
                        <button onClick={() => updateStatus(selectedOrder.id, 'cancelado')} className="border border-red-500/20 text-red-500 py-3 rounded-xl text-[9px] font-black uppercase transition-all italic">Can</button>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Notas internas</p>
                    <textarea value={obsText} onChange={(e) => setObsText(e.target.value)} className="flex-grow bg-white/5 border border-white/5 rounded-2xl p-3 text-xs font-bold resize-none outline-none focus:border-white/20" placeholder="Escribir..."/>
                    <button onClick={() => ordersApi.update(selectedOrder.id, { observation: obsText }).then(() => fetchData())} className="mt-2 bg-white/10 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Guardar Nota</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  function selectedProductItems(items) {
    return items.map(item => (
        <div key={item.id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
           <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center font-black text-[9px] text-primary">{item.quantity}x</div>
             <p className="text-[10px] font-black uppercase tracking-tighter text-white/80">{item.product_name}</p>
           </div>
           <p className="text-[9px] font-bold text-white/20 italic font-medium">S/ {item.price}</p>
        </div>
      ));
  }
};

export default AdminOrders;
