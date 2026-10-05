import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product } from "../types";
import { useAuth } from "../hooks/useAuth";
import {
  db,
  doc,
  getDoc,
  setDoc,
  handleFirestoreError,
  OperationType,
} from "../firebase";

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

const GUEST_CART_KEY = "aura_cart";

/**
 * Safely parse guest cart items from localStorage.
 */
function getGuestCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse guest cart from localStorage:", error);
  }
  return [];
}

/**
 * Merge matrix implementation:
 * - Guest empty + remote exists → use remote cart.
 * - Guest exists + remote empty/nonexistent → keep guest cart and persist it.
 * - Both exist → merge both.
 * - Preserve unique products from both carts.
 * - For the same product, quantity: remote.quantity + guest.quantity capped at guestItem.product.stock || 99
 * - For duplicate products, guest priceAtAdded takes priority (latest guest-side price).
 */
function mergeCarts(guestItems: CartItem[], remoteItems: CartItem[]): CartItem[] {
  if (!guestItems || guestItems.length === 0) {
    return remoteItems || [];
  }
  if (!remoteItems || remoteItems.length === 0) {
    return guestItems;
  }

  const merged: CartItem[] = [];
  const processedGuestIds = new Set<string>();

  // Process remote items and merge overlapping products with guest items
  for (const remoteItem of remoteItems) {
    const guestItem = guestItems.find(
      (g) => g.product && remoteItem.product && g.product.id === remoteItem.product.id
    );

    if (guestItem) {
      processedGuestIds.add(guestItem.product.id);
      const stockLimit = guestItem.product.stock || remoteItem.product?.stock || 99;
      const combinedQuantity = remoteItem.quantity + guestItem.quantity;
      const finalQuantity = Math.min(combinedQuantity, stockLimit);

      merged.push({
        product: guestItem.product || remoteItem.product,
        quantity: finalQuantity,
        priceAtAdded: guestItem.priceAtAdded,
      });
    } else {
      // Preserve unique product from remote cart
      merged.push(remoteItem);
    }
  }

  // Preserve unique products from guest cart that weren't in remote cart
  for (const guestItem of guestItems) {
    if (guestItem.product && !processedGuestIds.has(guestItem.product.id)) {
      merged.push(guestItem);
    }
  }

  return merged;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Keep ref of items to capture any guest additions before auth transition
  const itemsRef = useRef<CartItem[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const prevUidRef = useRef<string | null | undefined>(undefined);
  const lastPersistedJsonRef = useRef<string | null>(null);

  // Load cart on auth state transitions
  useEffect(() => {
    let cancelled = false;
    const currentUid = user?.uid ?? null;

    // Skip if user UID hasn't changed (e.g. non-auth profile updates or re-renders)
    if (prevUidRef.current !== undefined && prevUidRef.current === currentUid) {
      return;
    }

    const loadCart = async () => {
      // 1. Handle Logout: user became null while previously authenticated
      if (user === null) {
        if (prevUidRef.current !== null && prevUidRef.current !== undefined) {
          // Clear in-memory cart state
          // Clear aura_cart localStorage data
          // Do not touch or overwrite remote Firestore cart
          localStorage.removeItem(GUEST_CART_KEY);
          lastPersistedJsonRef.current = JSON.stringify([]);
          setItems([]);
          setLoadedFor("guest");
          prevUidRef.current = null;
          return;
        }

        // Initial guest load
        const guestCart = getGuestCartFromStorage();
        if (cancelled) return;
        lastPersistedJsonRef.current = JSON.stringify(guestCart);
        setItems(guestCart);
        setLoadedFor("guest");
        prevUidRef.current = null;
        return;
      }

      // 2. Handle Authenticated User: Guest → Login or initial authenticated load
      setLoadedFor(null);
      const path = `carts/${user.uid}`;
      let remoteItems: CartItem[] = [];

      try {
        const cartDoc = await getDoc(doc(db, "carts", user.uid));
        if (cancelled) return;

        if (cartDoc.exists()) {
          remoteItems = cartDoc.data().items || [];
        }
      } catch (error) {
        if (cancelled) return;
        handleFirestoreError(error, OperationType.GET, path);
        // Requirement 6: If Firestore fetch fails, do NOT wipe the existing in-memory/guest cart.
        // Avoid destructive fallback behavior.
        return;
      }

      if (cancelled) return;

      // Baseline guest cart: use storage items or in-memory items if previous session was guest
      const storageItems = getGuestCartFromStorage();
      let guestItems = storageItems;
      if (prevUidRef.current === null && itemsRef.current.length > storageItems.length) {
        guestItems = itemsRef.current;
      }

      // Merge according to merge matrix
      const mergedItems = mergeCarts(guestItems, remoteItems);

      // If guest had items, persist the merged cart to Firestore
      if (guestItems.length > 0) {
        try {
          await setDoc(doc(db, "carts", user.uid), { items: mergedItems });
        } catch (error) {
          if (cancelled) return;
          handleFirestoreError(error, OperationType.WRITE, path);
          // If remote persistence failed, keep local cart in memory and storage so items aren't lost
          setItems(mergedItems);
          setLoadedFor(user.uid);
          prevUidRef.current = user.uid;
          return;
        }
      }

      if (cancelled) return;

      // Clean up stale guest aura_cart from localStorage
      localStorage.removeItem(GUEST_CART_KEY);
      lastPersistedJsonRef.current = JSON.stringify(mergedItems);

      // Update React state
      setItems(mergedItems);
      setLoadedFor(user.uid);
      prevUidRef.current = user.uid;
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Save cart to local storage or Firestore on item mutations
  useEffect(() => {
    const saveCart = async () => {
      // Avoid saving before initial load or during transitions
      if (loadedFor === null) return;
      if (loadedFor !== (user?.uid ?? "guest")) return;

      const currentJson = JSON.stringify(items);
      if (lastPersistedJsonRef.current === currentJson) {
        return;
      }

      if (user) {
        const path = `carts/${user.uid}`;
        try {
          await setDoc(doc(db, "carts", user.uid), { items });
          lastPersistedJsonRef.current = currentJson;
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      } else {
        if (items.length > 0) {
          localStorage.setItem(GUEST_CART_KEY, currentJson);
        } else {
          localStorage.removeItem(GUEST_CART_KEY);
        }
        lastPersistedJsonRef.current = currentJson;
      }
    };

    saveCart();
  }, [items, user, loadedFor]);

  const addToCart = (product: Product, price: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1, priceAtAdded: price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.priceAtAdded * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

