import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Currency {
  id: number;
  name: string;
  distribution: number;
  symbol?: string | null;
  created_at: string;
}

interface CurrencyStore {
  currencies: Currency[];
  activeCurrency: Currency | null;
  setCurrencies: (currencies: Currency[] | undefined) => void;
  setActiveCurrency: (currency: Currency | null) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currencies: [],
      activeCurrency: null,
      setCurrencies: (currencies) => {
        set(() => ({
          currencies: currencies || [],
        }));
      },
      setActiveCurrency: (currency) => {
        set(() => ({
          activeCurrency: currency,
        }));
      },
    }),
    {
      name: 'currency-store',
    }
  )
);
