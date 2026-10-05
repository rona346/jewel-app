import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ShoppingBag,
  ShieldCheck,
  Lock,
  Truck,
  User as UserIcon,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { db, doc, setDoc, collection, getDoc } from "../firebase";
import { Order } from "../types";
import { toast } from "sonner";

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Customer shipping information
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });

  // Pre-fill user name if authenticated
  useEffect(() => {
    if (user?.displayName && !shippingAddress.fullName) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.displayName,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user) {
      toast.error("Please sign in to place your order.");
      await login();
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!shippingAddress.street.trim() || !shippingAddress.city.trim()) {
      toast.error("Please provide your delivery address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderRef = doc(collection(db, "orders"));
      const orderId = orderRef.id;
      const createdAt = new Date().toISOString();

      const newOrder: Order = {
        id: orderId,
        userId: user.uid,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtAdded,
          image: item.product.images[0] || "",
          metalType: item.product.metalType,
          purity: item.product.purity,
        })),
        totalAmount: totalPrice,
        status: "Processing",
        createdAt,
        shippingAddress: {
          fullName:
            shippingAddress.fullName.trim() ||
            user.displayName ||
            "Valued Client",
          street: shippingAddress.street.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          postalCode: shippingAddress.postalCode.trim() || "00000",
          country: shippingAddress.country.trim() || "United States",
        },
        paymentMethod: "Portfolio Demo (Complimentary)",
      };

      await setDoc(orderRef, newOrder);

      clearCart();
      setPlacedOrder(newOrder);
      setSearchParams({ orderId: newOrder.id }, { replace: true });
      toast.success("Order placed successfully! Thank you for choosing Aura.");
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error(
        "Failed to place order. Please check your network and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restore order confirmation from Firestore on mount/refresh if orderId is in query params
  useEffect(() => {
    if (!orderIdParam) return;
    if (placedOrder && placedOrder.id === orderIdParam) return;

    if (authLoading) return;

    if (!user) {
      toast.error("Please sign in to view this order confirmation.");
      setSearchParams({}, { replace: true });
      return;
    }

    let isMounted = true;
    const fetchOrder = async () => {
      try {
        setIsFetchingOrder(true);
        const orderSnap = await getDoc(doc(db, "orders", orderIdParam));

        if (!isMounted) return;

        if (orderSnap.exists()) {
          const orderData = orderSnap.data() as Order;
          // Verify ownership: order must belong to currently authenticated user
          if (orderData.userId === user.uid) {
            setPlacedOrder(orderData);
          } else {
            toast.error("You do not have permission to view this order.");
            setSearchParams({}, { replace: true });
          }
        } else {
          toast.error("Order not found.");
          setSearchParams({}, { replace: true });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to restore order:", error);
        toast.error("Failed to load order confirmation.");
        setSearchParams({}, { replace: true });
      } finally {
        if (isMounted) {
          setIsFetchingOrder(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderIdParam, authLoading, user, placedOrder]);

  // RESTORING ORDER STATE VIEW
  if (orderIdParam && (authLoading || isFetchingOrder)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center mx-auto mb-6 text-[#D4AF37]">
          <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold block mb-2">
          Concierge Services
        </span>
        <h1 className="text-3xl font-serif text-white mb-2">
          Retrieving Your Order
        </h1>
        <p className="text-white/50 text-xs font-mono">
          Verifying acquisition records for #{orderIdParam.slice(0, 8).toUpperCase()}...
        </p>
      </div>
    );
  }

  // SUCCESS STATE VIEW
  if (placedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#D4AF37]/30 p-8 sm:p-12 rounded-sm shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center mx-auto mb-6 text-[#D4AF37]">
              <CheckCircle size={32} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold block mb-2">
              Order Confirmed
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-white mb-4">
              Thank You for Your Order
            </h1>
            <p className="text-white/60 text-sm max-w-lg mx-auto">
              Your order has been recorded and will be prepared with bespoke
              inspections by our master jewelers.
            </p>
          </div>

          {/* Reference metadata card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-black/40 border border-white/5 rounded-sm mb-10 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                Order ID
              </span>
              <span className="font-mono text-white font-bold">
                #{placedOrder.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                Status
              </span>
              <span className="inline-block px-2 py-0.5 rounded-xs bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider">
                {placedOrder.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                Date
              </span>
              <span className="text-white font-mono">
                {new Date(placedOrder.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                Delivery
              </span>
              <span className="text-white font-medium">Insured Express</span>
            </div>
          </div>

          {/* Ordered items recap */}
          <div className="space-y-4 mb-10">
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
              Items Ordered
            </h2>
            <div className="divide-y divide-white/5 border-y border-white/5">
              {placedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName || "Product"}
                        className="w-14 h-14 object-cover rounded-sm bg-black border border-white/10"
                      />
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {item.productName || `Item #${item.productId}`}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                        {item.metalType} • {item.purity} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-white text-sm">
                      $
                      {(item.priceAtPurchase * item.quantity).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-[#0A0A0A] border border-white/5 rounded-sm mb-10 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
                Shipping Destination
              </span>
              <p className="text-white font-bold">
                {placedOrder.shippingAddress?.fullName}
              </p>
              <p className="text-white/60">
                {placedOrder.shippingAddress?.street}
              </p>
              <p className="text-white/60">
                {placedOrder.shippingAddress?.city}
                {placedOrder.shippingAddress?.state
                  ? `, ${placedOrder.shippingAddress.state}`
                  : ""}
                , {placedOrder.shippingAddress?.postalCode}
              </p>
              <p className="text-white/60">
                {placedOrder.shippingAddress?.country}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
                Payment & Total
              </span>
              <p className="text-white/60 mb-1">
                Method:{" "}
                <span className="text-white font-medium">
                  {placedOrder.paymentMethod}
                </span>
              </p>
              <p className="text-white/60 mb-2">
                Insured Shipping:{" "}
                <span className="text-green-400 font-medium">
                  Complimentary
                </span>
              </p>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="font-serif text-white">Total Amount</span>
                <span className="font-mono text-xl text-[#D4AF37] font-bold">
                  $
                  {placedOrder.totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white/10 transition-colors text-center"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-white/40">
          <ShoppingBag size={32} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold block mb-2">
          Your Collection
        </span>
        <h1 className="text-4xl font-serif text-white mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Explore our collection of fine handcrafted jewellery and add pieces to
          your collection before proceeding to checkout.
        </p>
        <Link
          to="/catalog"
          className="inline-block px-10 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  // MAIN CHECKOUT VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 mb-8">
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <ChevronRight size={10} />
        <Link to="/catalog" className="hover:text-white">
          Catalog
        </Link>
        <ChevronRight size={10} />
        <span className="text-white">Checkout</span>
      </div>

      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold block mb-2">
          Concierge Services
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-white">
          Luxury <span className="text-[#D4AF37]">Checkout</span>
        </h1>
        <p className="text-white/50 text-sm mt-2 max-w-2xl">
          Complete your acquisition with complimentary insured global shipping
          and signature packaging.
        </p>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* LEFT COLUMN: Customer Info, Shipping & Guarantees (7 cols) */}
        <div className="lg:col-span-7 space-y-10">
          {/* Customer / Authentication Section */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <UserIcon size={18} className="text-[#D4AF37]" />
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-white">
                  Customer Information
                </h2>
              </div>
              {user && (
                <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold">
                  Verified Client
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-sm">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full border border-[#D4AF37]/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold">
                    {user.displayName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {user.displayName}
                  </h3>
                  <p className="text-xs text-white/50 font-mono">{user.email}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                    UID: {user.uid.slice(0, 12)}...
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-sm">
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Please sign in to link this acquisition to your verified
                  client account and activate insured shipping records.
                </p>
                <button
                  type="button"
                  onClick={login}
                  className="px-6 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon size={14} />
                  Sign In with Google
                </button>
              </div>
            )}
          </div>

          {/* Shipping Destination Form */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-6">
              <Truck size={18} className="text-[#D4AF37]" />
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-white">
                Shipping Destination
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-black border border-white/10 p-3.5 text-sm text-white rounded-sm focus:border-[#D4AF37] outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  placeholder="e.g. 742 Evergreen Terrace, Suite 400"
                  className="w-full bg-black border border-white/10 p-3.5 text-sm text-white rounded-sm focus:border-[#D4AF37] outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="e.g. New York"
                    className="w-full bg-black border border-white/10 p-3.5 text-sm text-white rounded-sm focus:border-[#D4AF37] outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="e.g. NY"
                    className="w-full bg-black border border-white/10 p-3.5 text-sm text-white rounded-sm focus:border-[#D4AF37] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 10001"
                    className="w-full bg-black border border-white/10 p-3.5 text-sm text-white rounded-sm focus:border-[#D4AF37] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/10 p-3.5 text-sm text-white rounded-sm focus:border-[#D4AF37] outline-none transition-colors"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="India">India</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method (Demo) & Guarantees */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-[#D4AF37]" />
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-white">
                Payment & Security
              </h2>
            </div>
            <div className="p-4 bg-black/40 border border-[#D4AF37]/20 rounded-sm mb-6 flex items-start gap-4">
              <Sparkles size={20} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block mb-1">
                  Complimentary Portfolio Demo Checkout
                </span>
                <p className="text-xs text-white/50 leading-relaxed">
                  No payment card is charged. Your order will be securely logged
                  to Firestore for order fulfillment tracking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-[11px] text-white/50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span>Certified Pure Metal</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#D4AF37]" />
                <span>Fully Insured Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-[#D4AF37]" />
                <span>Luxury Presentation Box</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Cart Items (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-[#111111] border border-white/5 p-8 rounded-sm sticky top-28 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-white">
                Order Summary
              </h2>
              <span className="text-xs font-mono text-white/40">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="max-h-72 overflow-y-auto space-y-4 pr-1 divide-y divide-white/5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="pt-4 first:pt-0 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-sm bg-black border border-white/10 shrink-0"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">
                        {item.product.metalType} • {item.product.purity}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1 font-mono">
                        Qty: {item.quantity} × $
                        {item.priceAtAdded.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-white text-xs font-semibold shrink-0">
                    $
                    {(item.priceAtAdded * item.quantity).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-white/5 pt-6 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-widest text-[10px]">
                  Subtotal
                </span>
                <span className="font-mono text-white">
                  $
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-widest text-[10px]">
                  Insured Delivery
                </span>
                <span className="text-green-400 font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-widest text-[10px]">
                  Estimated Taxes
                </span>
                <span className="text-white/60">Included</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                  Total
                </span>
                <span className="font-mono text-3xl font-bold text-[#D4AF37]">
                  $
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            {user ? (
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Securing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>
                      Place Order • $
                      {totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={login}
                className="w-full py-5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-2xl"
              >
                <UserIcon size={16} />
                <span>Sign In to Place Order</span>
              </button>
            )}

            <p className="text-[9px] text-center text-white/30 uppercase tracking-widest leading-relaxed">
              By placing your order, you agree to Aura's Terms of Luxury Service
              and Insured Transit Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
