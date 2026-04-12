import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Instagram, Facebook, Phone } from 'lucide-react';
import { useState, useEffect, createContext, useContext } from 'react';

// Paginas Publicas
import Home from './pages/Home';
import CartPage from './pages/Cart';
import LoginPage from './pages/Login';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// --- CONTEXTO DEL CARRITO AVANZADO ---
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-3 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center text-white">
        <Link to="/" className="text-2xl font-black tracking-tighter italic group">
          RAPBOYS<span className="text-primary group-hover:text-white transition-colors">STORE</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5">
            <ShoppingCart size={18} className="group-hover:text-primary transition-colors" />
            {totalItems > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#020202] animate-in zoom-in">{totalItems}</span>}
          </Link>
          <Link to="/login" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5">
             <User size={18} className="group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary selection:text-white">
      <PublicNavbar />
      <div className="pt-20">{children}</div>
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
