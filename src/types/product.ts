export type StockStatus = 'all' | 'in-stock' | 'out-of-stock';

export type SortBy = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

export interface RawProduct extends Product {
  images?: string[];
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  stockStatus: StockStatus;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: ProductFilters;
}
