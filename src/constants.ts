import { Product, MetalRates } from './types';

export const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal Sets'] as const;
export const METALS = ['Gold', 'Silver', 'Platinum'] as const;

export const INITIAL_METAL_RATES: MetalRates = {
  gold: 75.50, // per gram (USD)
  silver: 0.95, // per gram (USD)
  platinum: 32.20, // per gram (USD)
  lastUpdated: new Date().toISOString(),
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Solitaire Diamond Ring',
    description: 'A timeless classic featuring a brilliant-cut solitaire diamond set in 18K gold.',
    category: 'Rings',
    metalType: 'Gold',
    baseWeight: 4.5,
    purity: '18K',
    price: 0, // Calculated dynamically
    makingCharges: 150,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'],
    stock: 5,
    rating: 4.8,
    isARSupported: true,
  },
  {
    id: '2',
    name: 'Ethereal Pearl Necklace',
    description: 'Exquisite South Sea pearls strung with a platinum clasp.',
    category: 'Necklaces',
    metalType: 'Platinum',
    baseWeight: 12.0,
    purity: '950',
    price: 0,
    makingCharges: 300,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'],
    stock: 2,
    rating: 4.9,
    isARSupported: true,
  },
  {
    id: '3',
    name: 'Golden Hoop Earrings',
    description: 'Classic 22K gold hoops for daily elegance.',
    category: 'Earrings',
    metalType: 'Gold',
    baseWeight: 6.2,
    purity: '22K',
    price: 0,
    makingCharges: 80,
    images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1000&auto=format&fit=crop'],
    stock: 10,
    rating: 4.5,
    isARSupported: true,
  },
  {
    id: '4',
    name: 'Silver Charm Bracelet',
    description: 'Delicate sterling silver bracelet with intricate charms.',
    category: 'Bracelets',
    metalType: 'Silver',
    baseWeight: 15.5,
    purity: '925',
    price: 0,
    makingCharges: 50,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'],
    stock: 15,
    rating: 4.2,
    isARSupported: true,
  },
];
