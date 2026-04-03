import { MetalRates } from '../types';
import { INITIAL_METAL_RATES } from '../constants';

// In a real app, this would fetch from an API like Metals-API or GoldAPI
export async function fetchMetalRates(): Promise<MetalRates> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add some random fluctuation for demo purposes
  const fluctuation = () => (Math.random() - 0.5) * 0.5;
  
  return {
    gold: INITIAL_METAL_RATES.gold + fluctuation(),
    silver: INITIAL_METAL_RATES.silver + fluctuation() * 0.05,
    platinum: INITIAL_METAL_RATES.platinum + fluctuation() * 0.2,
    lastUpdated: new Date().toISOString(),
  };
}

export function calculateProductPrice(baseWeight: number, metalRate: number, makingCharges: number): number {
  return (baseWeight * metalRate) + makingCharges;
}
