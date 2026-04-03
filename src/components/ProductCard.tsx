import { motion } from 'motion/react';
import { Star, Eye, ShoppingCart, Box } from 'lucide-react';
import { Product } from '../types';
import { calculateProductPrice } from '../services/metalRateService';
import { useMetalRates } from '../hooks/useMetalRates';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }: { product: Product }) {
  const { rates } = useMetalRates();
  const { addToCart } = useCart();
  const metalRate = product.metalType === 'Gold' ? rates.gold : product.metalType === 'Silver' ? rates.silver : rates.platinum;
  const currentPrice = calculateProductPrice(product.baseWeight, metalRate, product.makingCharges);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#111111] border border-white/5 overflow-hidden rounded-sm"
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <Link to={`/product/${product.id}`} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
            <Eye size={20} />
          </Link>
          <button 
            onClick={() => addToCart(product, currentPrice)}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D4AF37] transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        {product.isARSupported && (
          <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm flex items-center gap-1">
            <Box size={12} />
            AR Try-on
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">{product.category}</span>
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
            {product.rating}
          </div>
        </div>
        <h3 className="text-lg font-serif mb-2 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-mono text-white">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">{product.metalType} • {product.purity}</span>
        </div>
      </div>
    </motion.div>
  );
}
