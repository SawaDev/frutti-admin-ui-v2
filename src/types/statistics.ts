import { Product } from "./products";

interface Client {
  id: number;
  name: string;
  balance: number;
  currency: "SUM" | "USD";
}

interface FilteredProduct {
  id: number;
  name: number;
  price: number;
  price_in_dollar: number;
  production_cost: number;
  sale_quantity: number;
  sale_price: number;
  sale_distribution: number;
  sale_product: Product;
}

export type GetStatisticsResponse = {
  success: boolean;
  data: {
    weekly: {
      sales: {
        id: number;
        client_id: number;
        total_price: number;
        currency_name: string | null;
        distribution: number | null;
        is_free: boolean;
        date: string;
        client: Client;
        products: FilteredProduct[];
      }[];
      transactions: {
        id: number;
        type: "cash" | "card";
        amount: number;
        currency_name: string | null;
        distribution: number | null;
        date: string;
        client: Client;
      }[];
    };
    monthly: {
      month_number: number;
      total_transactions: number;
      total_net_profit: number;
      total_product_quantity: number;
      total_price: number;
    }[];
    debts: {
      [key: string]: {
        currency: string;
        total_debt: number;
      };
    };
    products_left: {
      total_quantity: number;
      total_cost_sum: number;
      total_cost_dollar: number;
    };
  };
};
