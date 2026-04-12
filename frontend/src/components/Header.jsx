import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          RAP<span className="text-primary">BOYS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link to="/" className="hover:text-white transition-colors">TIENDA</Link>
          <Link to="/about" className="hover:text-white transition-colors">NOSOTROS</Link>
          <Link to="/blog" className="hover:text-white transition-colors">BLOG</Link>
        </nav>

        <div className="flex items-center gap-5">
          <button className="text-white/70 hover:text-white"><Search size={20} /></button>
          <Link to="/checkout" className="text-white/70 hover:text-white relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </Link>
          <button className="text-white/70 hover:text-white"><User size={20} /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
