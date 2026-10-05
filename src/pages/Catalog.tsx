import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { SAMPLE_PRODUCTS, CATEGORIES, METALS } from '../constants';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesMetal = !selectedMetal || product.metalType === selectedMetal;
      return matchesSearch && matchesCategory && matchesMetal;
    });
  }, [searchQuery, selectedCategory, selectedMetal]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-serif mb-6">Our <span className="text-[#D4AF37]">Collections</span></h1>
        <p className="text-white/50 max-w-2xl">Discover a world of exquisite craftsmanship. From timeless classics to contemporary masterpieces, find the perfect piece for every moment.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-10">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] mb-6">Search</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] mb-6">Categories</h4>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`block text-sm transition-colors ${!selectedCategory ? 'text-white' : 'text-white/40 hover:text-white'}`}
              >
                All Collections
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block text-sm transition-colors ${selectedCategory === cat ? 'text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] mb-6">Metal Type</h4>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMetal(null)}
                className={`block text-sm transition-colors ${!selectedMetal ? 'text-white' : 'text-white/40 hover:text-white'}`}
              >
                All Metals
              </button>
              {METALS.map(metal => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={`block text-sm transition-colors ${selectedMetal === metal ? 'text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 text-[10px] uppercase tracking-widest font-bold text-white/30">
            <span>Showing {filteredProducts.length} Products</span>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              Sort By: Newest <ChevronDown size={12} />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <p className="text-white/30 font-serif italic text-xl mb-4">No pieces found matching your criteria.</p>
              <button onClick={() => { setSelectedCategory(null); setSelectedMetal(null); setSearchQuery(''); }} className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold hover:underline">Clear All Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
