import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import { Search, ShoppingBag, X, Plus, Minus, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../App';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addToCart } = useCart(); // Sistema global de carrito

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([productsApi.getAll(), productsApi.getCategories()]);
      setProducts(prodRes.data.results || prodRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProduct(null); // Cerramos el modal tras el éxito
    }, 1500);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '' || p.category === parseInt(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351473216-203be09638c6?q=80&w=2070')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">RapBoys Official <span className="text-primary italic">Shop</span></h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Calidad Barber para el Hogar</p>
        </div>
      </section>

      {/* Catálogo con Filtros */}
      <section className="container mx-auto px-6 -mt-10 relative z-20 pb-40">
        <div className="glass rounded-[40px] p-6 mb-16 border border-white/5 flex flex-col md:flex-row gap-8 items-center shadow-2xl bg-black/40">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..." 
              className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-[28px] py-5 pl-14 outline-none font-bold text-sm tracking-tight transition-all"
            />
          </div>
          <div className="relative w-full md:w-72 group">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10">
                <ShoppingBag size={18} />
             </div>
             <select 
               value={activeCategory} 
               onChange={(e) => setActiveCategory(e.target.value)}
               className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-[28px] py-5 pl-14 pr-8 outline-none font-black text-[10px] uppercase tracking-[0.2em] appearance-none cursor-pointer hover:bg-white/10 transition-all text-white"
             >
                <option value="" className="bg-black text-white">Todas las Categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id.toString()} className="bg-black text-white">
                    {cat.name.toUpperCase()}
                  </option>
                ))}
             </select>
             <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                <Minus size={14} className="rotate-90" />
             </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProducts.map((p) => (
              <div 
                key={p.id} 
                onClick={() => { setSelectedProduct(p); setQuantity(1); }}
                className="group cursor-pointer space-y-4 text-center"
              >
                <div className="aspect-square rounded-[56px] bg-white/5 overflow-hidden border border-white/5 relative group-hover:border-primary/40 transition-all duration-700 shadow-xl group-hover:shadow-primary/10">
                  {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-5"><ShoppingBag size={64} /></div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                     <span className="bg-primary text-white text-[10px] font-black px-8 py-4 rounded-full uppercase tracking-widest shadow-2xl">Explorar</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-2xl font-black italic text-primary mt-1">S/ {p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL MAESTRO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => !showSuccess && setSelectedProduct(null)} />
          <div className="relative glass w-full max-w-5xl h-fit max-h-[90vh] rounded-[56px] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
            
            {showSuccess ? (
              <div className="w-full p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-bounce">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">¡Agregado con Éxito!</h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Actualizando tu Carrito</p>
              </div>
            ) : (
              <>
                <div className="w-full md:w-1/2 p-10 flex items-center justify-center bg-white/[0.02]">
                  <div className="aspect-square w-full rounded-[48px] overflow-hidden border border-white/5 relative">
                    {selectedProduct.image ? <img src={selectedProduct.image} className="w-full h-full object-cover animate-in fade-in duration-700" alt={selectedProduct.name} /> : <div className="w-full h-full flex items-center justify-center opacity-5"><ShoppingBag size={100} /></div>}
                  </div>
                </div>

                <div className="w-full md:w-1/2 p-12 flex flex-col justify-between">
                   <div className="space-y-8">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{selectedProduct.category_name}</span>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                         </div>
                         <button onClick={() => setSelectedProduct(null)} className="text-white/20 hover:text-white transition-all"><X size={32}/></button>
                      </div>

                      <div className="flex items-center gap-1 text-yellow-500">
                         {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-white/20"}/>)}
                         <span className="ml-3 text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Rank: 4.8 / 5.0</span>
                      </div>

                      <p className="text-4xl font-black italic text-primary leading-none tracking-tighter">S/ {selectedProduct.price}</p>

                      <div className="space-y-6">
                        <p className="text-sm font-bold text-white/50 leading-relaxed italic">{selectedProduct.description || 'Calidad garantizada RapBoys para profesionales.'}</p>
                        <div className="grid grid-cols-1 gap-3">
                           {(selectedProduct.technical_features || 'Material Premium, Uso Profesional, Ergonómico').split(',').map((det, i) => (
                             <div key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white/30">
                               <CheckCircle2 size={14} className="text-primary"/> {det.trim()}
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="pt-10 flex flex-col gap-5">
                      <div className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Cantidad</span>
                        <div className="flex items-center gap-6">
                           <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-primary transition-all"><Minus size={18}/></button>
                           <span className="text-lg font-black w-6 text-center">{quantity}</span>
                           <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-primary transition-all"><Plus size={18}/></button>
                        </div>
                      </div>
                      <button 
                        onClick={handleAddToCart}
                        className="w-full bg-primary hover:bg-white text-black py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,107,0,0.1)] active:scale-95"
                      >
                        <ShoppingBag size={20}/> Añadir al Carrito
                      </button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
