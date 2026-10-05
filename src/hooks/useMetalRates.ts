import { useState, useEffect } from 'react';
import { MetalRates } from '../types';
import { fetchMetalRates } from '../services/metalRateService';
import { INITIAL_METAL_RATES } from '../constants';

export function useMetalRates() {
  const [rates, setRates] = useState<MetalRates>(INITIAL_METAL_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRates = async () => {
      const newRates = await fetchMetalRates();
      setRates(newRates);
      setLoading(false);
    };

    getRates();
    const interval = setInterval(getRates, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { rates, loading };
}
