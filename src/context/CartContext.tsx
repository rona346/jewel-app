import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from '../firebase';

interface CartItem {
  product: Product;
  quantity: number;
  priceAtAdded: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, price: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from local storage or Firestore
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const path = `carts/${user.uid}`;
        try {
          const cartDoc = await getDoc(doc(db, 'carts', user.uid));
          if (cartDoc.exists()) {
            setItems(cartDoc.data().items || []);
            return;
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      }
      
      const localCart = localStorage.getItem('aura_cart');
      if (localCart) {
        setItems(JSON.parse(localCart));
      }
    };

    loadCart();
  }, [user]);

  // Save cart to local storage or Firestore
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        const path = `carts/${user.uid}`;
        try {
          await setDoc(doc(db, 'carts', user.uid), { items });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      } else {
        localStorage.setItem('aura_cart', JSON.stringify(items));
      }
    };

    saveCart();
  }, [items, user]);

  const addToCart = (product: Product, price: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1, priceAtAdded: price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.priceAtAdded * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
