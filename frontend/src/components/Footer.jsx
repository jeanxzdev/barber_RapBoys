import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/5 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">RAPBOYS</h2>
          <p className="text-white/50 text-sm max-w-xs mb-6">
            La marca líder en productos de barbería profesional. Calidad urbana para el hombre moderno.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Enlaces</h3>
          <ul className="space-y-4 text-sm text-white/50">
            <li><a href="#" className="hover:text-white transition-colors">Productos</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Seguimiento</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
          </ul>
        </div>

        <div>
           <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Contacto</h3>
           <p className="text-sm text-white/50 mb-2">Jr. Unión 271, Trujillo</p>
           <p className="text-sm text-white/50 mb-2">+51 949 628 042</p>
           <p className="text-sm text-white/50">ventas@rapboys.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/30">
        © 2024 RapBoys Barber Brand. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
