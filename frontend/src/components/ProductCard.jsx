import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute bottom-4 right-4 bg-primary p-2 rounded-xl shadow-lg hover:bg-primary-dark transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
          <Plus size={20} />
        </button>
      </div>
      <div className="p-5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-white/40 text-xs mb-4 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-primary">S/ {product.price}</span>
          <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{product.category_name}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
