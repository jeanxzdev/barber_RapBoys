import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, UserCheck, UserX, Trash2, Loader2, ShieldCheck } from 'lucide-react';
import { usersApi } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAll();
      setUsers(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const deleteUser = async (id) => {
    if (window.confirm("¿Estás segur@ de eliminar a este cliente? Se borrarán sus registros.")) {
      try {
        await usersApi.delete(id);
        fetchData();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone && u.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-5 rounded-[24px] border border-white/5">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Base de Clientes</h1>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar email o teléfono..."
          className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-[20px] py-4 pl-16 outline-none font-bold text-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : (
        <div className="glass rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Identidad</th>
                <th className="px-8 py-5">Contacto</th>
                <th className="px-8 py-5">Estado RapBoys</th>
                <th className="px-8 py-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center opacity-20 uppercase font-black text-[10px]">No hay clientes que coincidan</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-lg italic">{u.email[0]}</div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{u.email}</p>
                          {u.is_staff && <span className="text-[8px] font-black text-primary uppercase mt-1 flex items-center gap-1"><ShieldCheck size={10}/> ADMIN</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-white/40 font-bold italic"><Phone size={12} className="inline mr-2 text-primary"/>{u.phone || 'S/N'}</td>
                    <td className="px-8 py-5">
                      {u.is_verified ? (
                        <span className="flex items-center gap-2 text-[9px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase italic w-fit border border-green-500/20"><UserCheck size={12} /> Verificado</span>
                      ) : (
                        <span className="flex items-center gap-2 text-[9px] font-black text-white/20 bg-white/5 px-3 py-1 rounded-full uppercase italic w-fit border border-white/5"><UserX size={12} /> Pendiente</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                         onClick={() => deleteUser(u.id)}
                         className="p-3 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
