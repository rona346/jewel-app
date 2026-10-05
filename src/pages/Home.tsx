import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import MetalRateTracker from '../components/MetalRateTracker';
import { SAMPLE_PRODUCTS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Product } from '../types';
import { getPersonalizedRecommendations } from '../services/geminiService';

export default function Home() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      getPersonalizedRecommendations(user, SAMPLE_PRODUCTS).then(setRecommendations);
    }
  }, [user]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/0 via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold mb-6 block"
          >
            Est. 1924 • Signature Collection
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-serif mb-8 leading-tight"
          >
            Timeless <span className="italic text-[#D4AF37]">Elegance</span> <br />
            Redefined
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Explore our curated collection of handcrafted jewellery, where heritage meets modern innovation with AI-powered styling and AR try-on.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/catalog" className="px-10 py-4 bg-[#D4AF37] text-black uppercase tracking-widest font-bold text-xs rounded-sm hover:bg-white transition-colors flex items-center gap-2">
              Explore Catalog <ArrowRight size={16} />
            </Link>
            <Link to="/schemes" className="px-10 py-4 border border-white/20 text-white uppercase tracking-widest font-bold text-xs rounded-sm hover:bg-white/10 transition-colors">
              Gold Schemes
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[8px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-12 bg-white" />
        </motion.div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-serif mb-4">Featured <span className="text-[#D4AF37]">Masterpieces</span></h2>
              <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Hand-picked by our master craftsmen</p>
            </div>
            <Link to="/catalog" className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SAMPLE_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="py-24 bg-[#0F0F0F] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Sparkles size={24} className="text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-3xl font-serif italic">Curated for <span className="text-[#D4AF37]">{user.displayName.split(' ')[0]}</span></h2>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">AI-Powered Recommendations based on your style</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Market Intelligence */}
      <MetalRateTracker />

      {/* Trust Badges */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col items-center text-center gap-4">
            <ShieldCheck size={32} className="text-[#D4AF37]" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-2">Certified Authentic</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">Every piece comes with a blockchain-backed certificate of authenticity.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Truck size={32} className="text-[#D4AF37]" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-2">Insured Shipping</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">Complimentary insured global shipping on all orders above $500.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Clock size={32} className="text-[#D4AF37]" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-2">Lifetime Warranty</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">We stand by our craftsmanship with a lifetime maintenance guarantee.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Sparkles size={32} className="text-[#D4AF37]" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-2">Virtual Stylist</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">Experience our AI-powered virtual styling and AR try-on features.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
