import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Image as ImageIcon, X, Loader2, Upload, Tag, Save, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { productsApi } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 5;
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', cost_price: '', stock: '', initial_stock: '', description: '', category: '', technical_features: '', image: null
  });
  
  const [newCatName, setNewCatName] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchData(); }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoryFilter, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, ...(searchTerm && { search: searchTerm }), ...(categoryFilter && { category: categoryFilter }) };
      const [productsRes, categoriesRes] = await Promise.all([productsApi.getAll(params), productsApi.getCategories()]);
      
      if (productsRes.data?.results) {
        setProducts(productsRes.data.results);
        setTotalCount(productsRes.data.count || 0);
        setTotalPages(Math.ceil((productsRes.data.count || 0) / PAGE_SIZE) || 1);
      } else {
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setTotalPages(1);
      }
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name || '', price: product.price || '', cost_price: product.cost_price || '',
        stock: product.stock || '', initial_stock: product.initial_stock || '',
        description: product.description || '', category: product.category_id || product.category || '',
        technical_features: product.technical_features || '', image: null
      });
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', price: '', cost_price: '', stock: '', initial_stock: '', description: '', category: '', technical_features: '', image: null });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      data.append('name', formData.name);
      data.append('slug', slug);
      data.append('price', formData.price);
      data.append('cost_price', formData.cost_price);
      data.append('stock', formData.stock);
      data.append('initial_stock', formData.initial_stock || formData.stock);
      data.append('category', formData.category);
      if (formData.image) data.append('image', formData.image);

      if (currentProduct) {
        await productsApi.update(currentProduct.id, data);
      } else {
        await productsApi.create(data);
      }
      
      setShowProductModal(false);
      setTimeout(() => fetchData(), 500);
    } catch (err) { 
      console.error(err);
      alert("Error al guardar. Verifica los datos."); 
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await productsApi.createCategory({ name: newCatName, slug: newCatName.toLowerCase().replace(/ /g, '-') });
      setNewCatName('');
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      alert("Error al crear categoría.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("⚠️ ¿REALMENTE DESEAS ELIMINAR ESTE PRODUCTO?")) {
      try {
        await productsApi.delete(id);
        fetchData();
      } catch (err) {
        alert("Error al eliminar el producto.");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("¿Eliminar esta categoría? Los productos asociados podrían quedar sin categoría.")) {
      try {
        await productsApi.deleteCategory(id);
        fetchData();
      } catch (err) {
        alert("Error al eliminar categoría.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-[24px] border border-white/5 shadow-xl">
        <div><h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-1">Inventario RapBoys</h1><span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{totalCount} ítems en almacén</span></div>
        <div className="flex gap-2">
            <button onClick={() => setShowCategoryModal(true)} className="bg-white/5 hover:bg-white/10 text-white/60 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 border border-white/5 uppercase tracking-widest">
                <Tag size={14} /> Nueva Categoría
            </button>
            <button onClick={() => handleOpenProductModal()} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 shadow-lg shadow-primary/20 uppercase tracking-widest">
                <Plus size={16} /> Nuevo Producto
            </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
          <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Buscar producto..." className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-2 pl-12 text-xs font-bold outline-none font-sans"/>
        </div>
        <div className="relative w-48 shadow-xl">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
           <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-2 pl-10 pr-4 text-xs font-bold outline-none appearance-none uppercase tracking-widest text-white/60 cursor-pointer">
             <option value="">FILTRO CATEGORÍA</option>
             {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
        </div>
      </div>

      <div className="glass rounded-[32px] overflow-hidden border border-white/5 shadow-2xl bg-black/20">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Venta</th>
              <th className="px-6 py-4">Costo</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Controles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={16} className="text-white/10" />}
                    </div>
                    <div>
                        <p className="font-bold text-[13px] tracking-tight text-white/90">{p.name}</p>
                        <p className="text-[9px] font-black text-white/20 uppercase">{p.category_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3"><p className="font-black text-primary italic text-[14px]">S/ {p.price}</p></td>
                <td className="px-6 py-3"><p className="font-black text-white/20 italic text-[14px]">S/ {p.cost_price || '0.00'}</p></td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${p.stock < 5 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                       {p.stock} UNI
                     </span>
                  </div>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2">
                    <button onClick={() => handleOpenProductModal(p)} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Edit3 size={15} /></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-white/20 hover:text-red-500 transition-all"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Página <span className="text-primary italic">{currentPage}</span> de {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 glass rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-20 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 glass rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-20 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTO */}
      {showProductModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={() => setShowProductModal(false)} />
          <div className="relative glass w-full max-w-2xl rounded-[40px] border border-white/10 p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Detalle de Registro</h2>
                <button onClick={() => setShowProductModal(false)} className="text-white/20 hover:text-white"><X size={24}/></button>
             </div>
             <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-8">
                <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-all relative group shadow-inner">
                  {formData.image ? <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt=""/> : currentProduct?.image ? <img src={currentProduct.image} className="w-full h-full object-cover" alt=""/> : <div className="text-center opacity-10"><Upload size={40} className="mx-auto mb-2"/><p className="text-[10px] font-black uppercase">Subir Foto</p></div>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><ImageIcon size={24}/></div>
                  <input type="file" ref={fileInputRef} onChange={(e) => setFormData({...formData, image: e.target.files[0]})} className="hidden" accept="image/*"/>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1"><label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Producto</label><input type="text" required placeholder="..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 shadow-inner text-sm font-bold outline-none focus:border-primary/50"/></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Categoría</label><select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-2 px-4 font-bold uppercase text-xs focus:border-primary/50 outline-none">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[9px] font-black text-primary uppercase tracking-widest ml-1">Venta</label><input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-primary font-black text-sm outline-none"/></div>
                    <div><label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Costo</label><input type="number" step="0.01" required value={formData.cost_price} onChange={(e) => setFormData({...formData, cost_price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white/40 font-black text-sm outline-none"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Stock</label><input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:border-primary/50"/></div>
                    <div><label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Inicial</label><input type="number" required value={formData.initial_stock} onChange={(e) => setFormData({...formData, initial_stock: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:border-primary/50"/></div>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:scale-[1.02] active:scale-95 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all mt-4 flex items-center justify-center gap-2">
                    <Save size={14} /> Guardar Cambios
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL CATEGORIA */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
            <div className="relative glass w-full max-w-md rounded-[32px] border border-white/10 p-8 shadow-2xl animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Gestionar Categorías</h2>
                    <button onClick={() => setShowCategoryModal(false)}><X size={20}/></button>
                </div>
                
                <form onSubmit={handleCategorySubmit} className="space-y-4 mb-8">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-primary uppercase tracking-widest ml-1">Nuevo Nombre</label>
                        <div className="flex gap-2">
                             <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Ej: Máquinas" className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary/50" />
                             <button type="submit" className="bg-primary text-white p-3 rounded-xl hover:scale-105 transition-all"><Plus size={20}/></button>
                        </div>
                    </div>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-[8px] font-black uppercase text-white/20 tracking-[0.3em] mb-3">Lista Existente</p>
                    {categories.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 group">
                            <span className="text-[10px] font-black uppercase tracking-widest italic">{c.name}</span>
                            <button onClick={() => handleDeleteCategory(c.id)} className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
