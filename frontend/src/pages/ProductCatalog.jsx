const ProductCatalog = () => {
  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      <div className="flex justify-between items-end mb-16">
        <div className="space-y-2">
          <span className="text-primary text-[10px] font-black uppercase tracking-widest">Equipamiento Premium</span>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Catalogo Oficial</h2>
        </div>
        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Mostrando: Todos los Productos</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white/5 aspect-[4/5] rounded-[40px] border border-white/5 flex items-center justify-center opacity-20">
           <p className="text-[10px] font-black uppercase tracking-widest">Cargando Productos...</p>
        </div>
      </div>
    </div>
  );
};
export default ProductCatalog;
