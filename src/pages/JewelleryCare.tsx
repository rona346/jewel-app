import { motion } from 'motion/react';
import { Sparkles, Droplets, Shield, Sun, Wind, Gem } from 'lucide-react';

export default function JewelleryCare() {
  const careTips = [
    {
      icon: <Droplets size={24} />,
      title: "Cleaning",
      description: "Use a mild soap and warm water solution to gently clean your jewellery. Avoid harsh chemicals or abrasive cleaners."
    },
    {
      icon: <Shield size={24} />,
      title: "Storage",
      description: "Store each piece separately in its original box or a soft pouch to prevent scratches and tangling."
    },
    {
      icon: <Sun size={24} />,
      title: "Avoid Direct Sunlight",
      description: "Prolonged exposure to direct sunlight or extreme heat can damage certain gemstones and metals."
    },
    {
      icon: <Wind size={24} />,
      title: "Chemical Exposure",
      description: "Remove your jewellery before applying perfumes, lotions, or using household cleaning products."
    },
    {
      icon: <Gem size={24} />,
      title: "Regular Inspection",
      description: "We recommend a professional inspection every 6 months to ensure settings and clasps are secure."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Professional Polishing",
      description: "Bring your pieces to our store for complimentary professional cleaning and polishing once a year."
    }
  ];

  const materialCare = [
    {
      material: "Gold & Platinum",
      tips: "Wipe with a soft, lint-free cloth after wearing to remove oils and sweat. Avoid chlorine as it can weaken the metal structure."
    },
    {
      material: "Diamonds",
      tips: "Diamonds are tough but can chip. Avoid wearing them during heavy physical activity. Clean regularly to maintain their brilliance."
    },
    {
      material: "Gemstones",
      tips: "Porous stones like opals or pearls require extra care. Never use ultrasonic cleaners on them; only a damp cloth."
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
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Preserving Brilliance</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Jewellery Care</h1>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
            Every piece of jewellery is a masterpiece that deserves to be cherished. Follow our expert guide to ensure your treasures last for generations.
          </p>
        </motion.div>

        {/* General Care Grid */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careTips.map((item, index) => (
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

        {/* Material Specific Section */}
        <section className="mb-32">
          <h2 className="text-3xl font-serif mb-12 text-center">Material-Specific Care</h2>
          <div className="space-y-6">
            {materialCare.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8 bg-[#111] border border-white/5 p-10 rounded-sm"
              >
                <div className="md:w-1/3">
                  <h3 className="text-xl font-serif text-[#D4AF37]">{item.material}</h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-white/60 leading-relaxed">{item.tips}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professional Service CTA */}
        <div className="text-center p-12 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-sm">
          <Sparkles className="text-[#D4AF37] mx-auto mb-6" size={32} />
          <h3 className="text-xl font-serif mb-4">Professional Maintenance</h3>
          <p className="text-sm text-white/50 mb-8">Visit our boutique for a complimentary inspection and professional cleaning of your luxury pieces.</p>
          <button className="px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors">
            Book a Service
          </button>
        </div>
      </div>
    </div>
  );
}
