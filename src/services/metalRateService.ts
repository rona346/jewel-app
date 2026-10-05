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

export function getPurityMultiplier(purity?: string): number {
  if (!purity) return 1;

  const clean = purity.trim().replace(/^(?:au|pt|ag)\s*/i, '');

  // Karat format (e.g. '18K', '22KT', '24k')
  const karatMatch = clean.match(/^(\d+(?:\.\d+)?)\s*k(?:t)?$/i);
  if (karatMatch) {
    const karat = parseFloat(karatMatch[1]);
    return karat > 0 ? karat / 24 : 1;
  }

  // Percentage format (e.g. '75%', '92.5%')
  const percentMatch = clean.match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    const percent = parseFloat(percentMatch[1]);
    return percent > 0 ? percent / 100 : 1;
  }

  // Numeric values (e.g. '925', '950', '999', '750', '22', '18', '0.75')
  const num = parseFloat(clean);
  if (!isNaN(num) && num > 0) {
    if (num <= 1) return num;
    if (num <= 24) return num / 24;
    if (num <= 100) return num / 100;
    if (num <= 1000) return num / 1000;
  }

  return 1;
}

export function calculateProductPrice(
  baseWeight: number,
  metalRate: number,
  makingCharges: number,
  purity?: string,
): number {
  const purityMultiplier = getPurityMultiplier(purity);
  return (baseWeight * metalRate * purityMultiplier) + makingCharges;
}
