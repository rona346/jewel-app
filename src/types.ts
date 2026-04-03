export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  preferences?: {
    metalPreference?: string;
    budgetRange?: [number, number];
    occasions?: string[];
  };
  wishlist: string[];
  recentlyViewed: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets' | 'Bridal Sets';
  metalType: 'Gold' | 'Silver' | 'Platinum';
  baseWeight: number; // in grams
  purity: string;
  price: number;
  makingCharges: number;
  images: string[];
  stock: number;
  rating: number;
  isARSupported: boolean;
  arModelUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingUrl?: string;
  createdAt: string;
}

export interface GoldScheme {
  id: string;
  userId: string;
  planName: string;
  monthlyInstallment: number;
  installmentsPaid: number;
  totalBalance: number;
  startDate: string;
  status: 'Active' | 'Completed' | 'Redeemed';
}

export interface MetalRates {
  gold: number; // per gram
  silver: number; // per gram
  platinum: number; // per gram
  lastUpdated: string;
}
