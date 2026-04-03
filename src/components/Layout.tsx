import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Heart, Menu, X, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, login, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      <Toaster position="top-center" expand={false} richColors />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-serif tracking-widest text-[#D4AF37]">AURA</span>
              <span className="text-[10px] uppercase tracking-[0.3em] mt-1 opacity-50">Luxury Jewellery</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
              <Link to="/catalog" className="hover:text-[#D4AF37] transition-colors">Catalog</Link>
              <Link to="/schemes" className="hover:text-[#D4AF37] transition-colors">Gold Schemes</Link>
              <Link to="/about" className="hover:text-[#D4AF37] transition-colors">Our Story</Link>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/rates" className="hidden sm:flex items-center gap-2 text-[#D4AF37] hover:opacity-80 transition-opacity">
                <TrendingUp size={18} />
                <span className="text-xs font-mono">Live Rates</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <button className="hover:text-[#D4AF37] transition-colors"><Heart size={20} /></button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-[#D4AF37] transition-colors relative"
                >
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#D4AF37] text-black text-[8px] font-bold flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-[#D4AF37]" />
                    <button onClick={logout} className="text-xs opacity-50 hover:opacity-100 uppercase tracking-wider">Logout</button>
                  </div>
                ) : (
                  <button onClick={login} className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:text-[#D4AF37] transition-colors">
                    <User size={20} />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>

              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8 text-2xl font-serif text-center">
              <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
              <Link to="/schemes" onClick={() => setIsMenuOpen(false)}>Gold Schemes</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>Our Story</Link>
              <Link to="/rates" onClick={() => setIsMenuOpen(false)} className="text-[#D4AF37]">Live Rates</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/10 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-serif tracking-widest text-[#D4AF37]">AURA</span>
            <p className="mt-6 text-white/50 max-w-md leading-relaxed">
              Crafting timeless elegance since 1924. Our pieces are more than just jewellery; they are stories of heritage, precision, and luxury.
            </p>
          </div>
          <div>
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold mb-6">Collections</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/catalog?cat=Bridal" className="hover:text-white transition-colors">Bridal Couture</Link></li>
              <li><Link to="/catalog?cat=Rings" className="hover:text-white transition-colors">Engagement Rings</Link></li>
              <li><Link to="/catalog?cat=Necklaces" className="hover:text-white transition-colors">Signature Necklaces</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/jewellery-care" className="hover:text-white transition-colors">Jewellery Care</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] opacity-30">
          <p>© 2026 Aura Luxury Jewellery. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
