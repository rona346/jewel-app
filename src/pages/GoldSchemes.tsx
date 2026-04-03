import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Calendar, ArrowUpRight, Bell, CheckCircle, Clock, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SCHEME_PLANS = [
  { id: '1', name: 'Aura Gold Saver', installment: 100, duration: 11, benefit: '1 Month Installment Bonus' },
  { id: '2', name: 'Elite Platinum Plan', installment: 500, duration: 12, benefit: '5% Discount on Making Charges' },
  { id: '3', name: 'Bridal Dream Scheme', installment: 1000, duration: 24, benefit: 'Zero Making Charges on Bridal Sets' },
];

export default function GoldSchemes() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-schemes' | 'explore'>('explore');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Wallet size={64} className="text-[#D4AF37] mb-8 opacity-20" />
        <h2 className="text-4xl font-serif mb-4">Secure Your <span className="text-[#D4AF37]">Future</span></h2>
        <p className="text-white/50 max-w-md mb-10 leading-relaxed">Join our exclusive gold saving schemes and plan for your special moments with ease. Log in to view your personalized dashboard.</p>
        <button onClick={login} className="px-10 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors">
          Sign In to Access Schemes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-serif mb-4">Gold <span className="text-[#D4AF37]">Schemes</span></h1>
          <p className="text-white/50 max-w-md">Smart ways to save and invest in your dream jewellery collection.</p>
        </div>
        <div className="flex bg-[#111] p-1 rounded-sm border border-white/5">
          <button 
            onClick={() => setActiveTab('explore')}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors ${activeTab === 'explore' ? 'bg-[#D4AF37] text-black' : 'text-white/40 hover:text-white'}`}
          >
            Explore Plans
          </button>
          <button 
            onClick={() => setActiveTab('my-schemes')}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors ${activeTab === 'my-schemes' ? 'bg-[#D4AF37] text-black' : 'text-white/40 hover:text-white'}`}
          >
            My Dashboard
          </button>
        </div>
      </div>

      {activeTab === 'explore' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SCHEME_PLANS.map(plan => (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -10 }}
              className="bg-[#111] border border-white/5 p-10 rounded-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <h3 className="text-2xl font-serif mb-6">{plan.name}</h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/30">Monthly Installment</span>
                  <span className="text-xl font-mono text-[#D4AF37]">${plan.installment}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/30">Duration</span>
                  <span className="text-sm font-bold">{plan.duration} Months</span>
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <CheckCircle size={16} className="text-[#D4AF37] mt-0.5" />
                  <p className="text-xs text-white/60 leading-relaxed">{plan.benefit}</p>
                </div>
              </div>
              <button className="w-full py-4 border border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-black transition-colors">
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111] p-8 border border-white/5 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-4">Total Savings</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-mono text-white">$1,200.00</span>
                <span className="text-xs text-green-500 font-bold mb-1">+12%</span>
              </div>
            </div>
            <div className="bg-[#111] p-8 border border-white/5 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-4">Active Schemes</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-mono text-white">02</span>
                <span className="text-xs text-white/30 uppercase tracking-widest mb-1">Plans</span>
              </div>
            </div>
            <div className="bg-[#111] p-8 border border-white/5 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-4">Next Payment</span>
              <div className="flex items-center gap-3">
                <Calendar size={24} className="text-[#D4AF37]" />
                <div>
                  <span className="text-lg font-bold block">April 15, 2026</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">In 14 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Schemes Table */}
          <div className="bg-[#111] border border-white/5 rounded-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif">Active <span className="text-[#D4AF37]">Engagements</span></h3>
              <button className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] flex items-center gap-2">
                View History <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                    <th className="px-8 py-6 font-bold">Scheme Name</th>
                    <th className="px-8 py-6 font-bold">Progress</th>
                    <th className="px-8 py-6 font-bold">Balance</th>
                    <th className="px-8 py-6 font-bold">Status</th>
                    <th className="px-8 py-6 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <span className="font-bold block">Aura Gold Saver</span>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">Started Jan 2026</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[36%] h-full bg-[#D4AF37]" />
                        </div>
                        <span className="text-[10px] font-mono">04/11</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono">$400.00</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] uppercase tracking-widest font-bold rounded-full">On Track</span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-[#D4AF37] hover:underline">Pay Installment</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
