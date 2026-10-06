/** Server-authoritative product facts mirrored for analytics. Prices here are display/analytics only; the checkout Function owns the real amount. */
export interface CatalogProduct {
  id: string;
  name: string;
  amountUsd: number;
  currency: 'USD';
}

export const PRODUCTS: Record<string, CatalogProduct> = {
  'revenue-optimization-diagnostic': {
    id: 'revenue-optimization-diagnostic',
    name: 'Revenue Optimization Diagnostic',
    amountUsd: 2500,
    currency: 'USD',
  },
};

export const getProduct = (id: string): CatalogProduct | undefined => PRODUCTS[id];
