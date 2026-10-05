import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useMetalRates } from '../hooks/useMetalRates';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { format } from 'date-fns';

const generateMockHistory = (base: number, points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: format(new Date(Date.now() - (points - i) * 3600000), 'HH:mm'),
    price: base + (Math.random() - 0.5) * 2
  }));
};

export default function MetalRateTracker() {
  const { rates, loading } = useMetalRates();
  
  if (loading) return <div className="h-96 flex items-center justify-center text-[#D4AF37] font-serif italic">Loading live market data...</div>;

  const goldHistory = generateMockHistory(rates.gold, 24);
  const silverHistory = generateMockHistory(rates.silver, 24);
  const platinumHistory = generateMockHistory(rates.platinum, 24);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif mb-4">Market <span className="text-[#D4AF37]">Intelligence</span></h2>
          <p className="text-white/50 max-w-md">Real-time global metal rates. Our pricing updates every 60 seconds to ensure the most accurate valuation for your investment.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
          <Clock size={12} />
          Last Updated: {format(new Date(rates.lastUpdated), 'MMM dd, HH:mm:ss')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gold Card */}
        <div className="bg-[#111111] border border-white/5 p-8 rounded-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">24K Gold</span>
              <h3 className="text-3xl font-mono mt-1">${rates.gold.toFixed(2)}<span className="text-sm opacity-50 ml-1">/g</span></h3>
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
              <TrendingUp size={14} />
              +0.24%
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={goldHistory}>
                <defs>
                  <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="price" stroke="#D4AF37" fillOpacity={1} fill="url(#colorGold)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Silver Card */}
        <div className="bg-[#111111] border border-white/5 p-8 rounded-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">925 Silver</span>
              <h3 className="text-3xl font-mono mt-1">${rates.silver.toFixed(2)}<span className="text-sm opacity-50 ml-1">/g</span></h3>
            </div>
            <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
              <TrendingDown size={14} />
              -0.12%
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={silverHistory}>
                <defs>
                  <linearGradient id="colorSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="price" stroke="#FFFFFF" fillOpacity={1} fill="url(#colorSilver)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platinum Card */}
        <div className="bg-[#111111] border border-white/5 p-8 rounded-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">950 Platinum</span>
              <h3 className="text-3xl font-mono mt-1">${rates.platinum.toFixed(2)}<span className="text-sm opacity-50 ml-1">/g</span></h3>
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
              <TrendingUp size={14} />
              +0.45%
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platinumHistory}>
                <defs>
                  <linearGradient id="colorPlatinum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Area type="monotone" dataKey="price" stroke="#60A5FA" fillOpacity={1} fill="url(#colorPlatinum)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
