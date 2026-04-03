import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif">Your <span className="text-[#D4AF37]">Collection</span></h2>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">{totalItems} Items Selected</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="font-serif italic text-lg">Your collection is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-[#111] rounded-sm overflow-hidden shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold uppercase tracking-wider">{item.product.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-white/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{item.product.metalType} • {item.product.purity}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-white/30">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-mono text-[#D4AF37]">${(item.priceAtAdded * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-[#0F0F0F] border-t border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold">Subtotal</span>
                  <span className="text-2xl font-mono text-white">${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <button className="w-full py-5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-3">
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
                <p className="text-[8px] text-center text-white/20 uppercase tracking-widest mt-4">Complimentary Insured Shipping Included</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
