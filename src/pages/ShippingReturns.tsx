import { motion } from 'motion/react';
import { Truck, RefreshCw, ShieldCheck, Globe, Clock, Package } from 'lucide-react';

export default function ShippingReturns() {
  const shippingInfo = [
    {
      icon: <Globe size={24} />,
      title: "Global Delivery",
      description: "We offer secure, insured shipping to over 50 countries worldwide. Each piece is handled with extreme care."
    },
    {
      icon: <Clock size={24} />,
      title: "Processing Time",
      description: "Standard orders are processed within 2-3 business days. Custom bridal sets may require 10-14 business days."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Fully Insured",
      description: "Your purchase is fully insured from the moment it leaves our vault until it reaches your doorstep."
    }
  ];

  const returnSteps = [
    {
      step: "01",
      title: "Initiate Request",
      description: "Contact our concierge within 15 days of delivery to request a return authorization."
    },
    {
      step: "02",
      title: "Secure Packaging",
      description: "Place the item in its original luxury packaging with all certificates and tags intact."
    },
    {
      step: "03",
      title: "Complimentary Pickup",
      description: "We will arrange a secure, insured courier to collect the package from your location."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Concierge Services</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Shipping & Returns</h1>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
            Ensuring your luxury experience is seamless from our vault to your hands. We prioritize security, speed, and absolute satisfaction.
          </p>
        </motion.div>

        {/* Shipping Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Truck className="text-[#D4AF37]" size={24} />
            </div>
            <h2 className="text-2xl font-serif">Shipping Excellence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingInfo.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111] p-8 border border-white/5 rounded-sm"
              >
                <div className="text-[#D4AF37] mb-6">{item.icon}</div>
                <h3 className="text-lg font-serif mb-4">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Returns Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <RefreshCw className="text-[#D4AF37]" size={24} />
            </div>
            <h2 className="text-2xl font-serif">15-Day Return Policy</h2>
          </div>

          <div className="bg-[#111] border border-white/5 p-10 rounded-sm mb-12">
            <p className="text-white/60 leading-relaxed mb-8">
              We stand by the craftsmanship of every piece. If you are not completely satisfied, we offer a complimentary 15-day return policy for all unworn jewellery in its original condition.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {returnSteps.map((item, index) => (
                <div key={index} className="relative">
                  <span className="text-4xl font-serif text-[#D4AF37]/20 absolute -top-4 -left-2">{item.step}</span>
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{item.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <div className="text-center p-12 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-sm">
          <Package className="text-[#D4AF37] mx-auto mb-6" size={32} />
          <h3 className="text-xl font-serif mb-4">Need further assistance?</h3>
          <p className="text-sm text-white/50 mb-8">Our concierge team is available 24/7 to track your order or assist with returns.</p>
          <button className="px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors">
            Contact Concierge
          </button>
        </div>
      </div>
    </div>
  );
}
