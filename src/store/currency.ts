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
  setCurrencies: (currencies: Currency[] | undefined) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currencies: JSON.parse(localStorage.getItem("currency-store") ?? "[]") || [],
      setCurrencies: (currencies) =>
        set(() => ({
          currencies,
        })),
    }),
    {
      name: 'currency-store',
    }
  )
);
