import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, Truck, RefreshCw, Box, ShoppingBag, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../constants';
import { calculateProductPrice } from '../services/metalRateService';
import { useMetalRates } from '../hooks/useMetalRates';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import ARViewer from '../components/ARViewer';
import { getSmartStylistAdvice } from '../services/geminiService';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { rates } = useMetalRates();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(SAMPLE_PRODUCTS.find(p => p.id === id));
  const [activeImg, setActiveImg] = useState(product?.images[0]);
  const [isAROpen, setIsAROpen] = useState(false);
  const [stylistAdvice, setStylistAdvice] = useState<string | null>(null);
  const [isStylistLoading, setIsStylistLoading] = useState(false);

  const metalRate = product?.metalType === 'Gold' ? rates.gold : product?.metalType === 'Silver' ? rates.silver : rates.platinum;
  const currentPrice = product ? calculateProductPrice(product.baseWeight, metalRate, product.makingCharges) : 0;

  useEffect(() => {
    if (user && product) {
      setIsStylistLoading(true);
      getSmartStylistAdvice(user, "Wedding").then(advice => {
        setStylistAdvice(advice);
        setIsStylistLoading(false);
      });
    }
  }, [user, product]);

  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 mb-12">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight size={10} />
        <Link to="/catalog" className="hover:text-white">Catalog</Link>
        <ChevronRight size={10} />
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-[#111] border border-white/5 rounded-sm overflow-hidden relative group"
          >
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {product.isARSupported && (
              <button 
                onClick={() => setIsAROpen(true)}
                className="absolute bottom-6 left-6 px-6 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2 shadow-2xl hover:bg-white transition-colors"
              >
                <Box size={16} />
                AR Try-on
              </button>
            )}
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(img)}
                className={`aspect-square bg-[#111] border rounded-sm overflow-hidden transition-colors ${activeImg === img ? 'border-[#D4AF37]' : 'border-white/5'}`}
              >
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold block mb-2">{product.category}</span>
              <h1 className="text-5xl font-serif leading-tight">{product.name}</h1>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-[#D4AF37] mb-1">
                <Star size={16} className="fill-[#D4AF37]" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-widest">124 Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-mono text-white">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-sm text-white/40 uppercase tracking-widest">Incl. of all taxes</span>
          </div>

          <p className="text-white/60 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          {/* AI Stylist Advice */}
          <AnimatePresence>
            {stylistAdvice && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] p-6 mb-10 rounded-r-sm"
              >
                <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
                  <Sparkles size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Virtual Stylist Advice</span>
                </div>
                <p className="text-sm italic text-white/80 leading-relaxed">"{stylistAdvice}"</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-[#111] p-4 border border-white/5 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Metal</span>
              <span className="text-sm font-bold">{product.metalType} • {product.purity}</span>
            </div>
            <div className="bg-[#111] p-4 border border-white/5 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Weight</span>
              <span className="text-sm font-bold">{product.baseWeight} Grams</span>
            </div>
          </div>

          <div className="flex gap-4 mb-12">
            <button 
              onClick={() => addToCart(product, currentPrice)}
              className="flex-1 py-5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-3"
            >
              <ShoppingBag size={18} />
              Add to Collection
            </button>
            <button className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors">
              <Heart size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={20} className="text-[#D4AF37]" />
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-50">BIS Hallmarked</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={20} className="text-[#D4AF37]" />
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-50">Insured Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCw size={20} className="text-[#D4AF37]" />
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-50">15 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* AR Modal */}
      <AnimatePresence>
        {isAROpen && (
          <ARViewer 
            productImg={product.images[0]} 
            category={product.category}
            onClose={() => setIsAROpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
