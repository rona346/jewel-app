import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactUs() {
  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: "concierge@luxuryjewels.com",
      description: "Our team will respond within 24 hours."
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: "+1 (800) LUX-JEWEL",
      description: "Available Mon-Fri, 9am - 6pm EST."
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: "721 Fifth Avenue, New York, NY",
      description: "Our flagship boutique in Manhattan."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Contact Us</h1>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
            Whether you're looking for a custom piece or need assistance with an order, our concierge team is here to provide an exceptional experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-8">
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 p-6 bg-[#111] border border-white/5 rounded-sm"
              >
                <div className="text-[#D4AF37] mt-1">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-serif mb-1">{item.title}</h3>
                  <p className="text-[#D4AF37] font-medium mb-2">{item.details}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}

            <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                <Clock size={20} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Boutique Hours</h3>
              </div>
              <ul className="space-y-2 text-xs text-white/60">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>10:00 AM - 7:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>11:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-white/5 p-10 rounded-sm space-y-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-white/10 p-4 text-sm focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-black border border-white/10 p-4 text-sm focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subject</label>
                <select className="w-full bg-black border border-white/10 p-4 text-sm focus:border-[#D4AF37] outline-none transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Custom Jewellery Request</option>
                  <option>Order Status</option>
                  <option>Repair & Maintenance</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Message</label>
                <textarea 
                  rows={6}
                  className="w-full bg-black border border-white/10 p-4 text-sm focus:border-[#D4AF37] outline-none transition-colors resize-none"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>

              <button className="w-full py-5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-3">
                <Send size={16} />
                Send Message
              </button>
            </motion.form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-[400px] w-full bg-[#111] border border-white/5 rounded-sm overflow-hidden relative group">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
            <MapPin size={100} className="text-[#D4AF37]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-2">Visit Our Flagship Boutique</h3>
              <p className="text-white/40 text-sm">721 Fifth Avenue, Manhattan, New York</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
