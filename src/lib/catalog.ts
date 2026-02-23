import type { Product, ProductFilters, SortBy, StockStatus } from '@/types/product';

export const PAGE_SIZE = 12;

export const STOCK_OPTIONS: Array<{ label: string; value: StockStatus }> = [
  { label: 'All Products', value: 'all' },
  { label: 'In Stock', value: 'in-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' }
];

export const SORT_OPTIONS: Array<{ label: string; value: SortBy }> = [
  { label: 'Sort By', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating: High to Low', value: 'rating-desc' }
];

export const DEFAULT_FILTERS: ProductFilters = {
  searchTerm: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  minRating: '0',
  stockStatus: 'all'
};

function asNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function extractCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const query = filters.searchTerm.trim().toLowerCase();
  const minPrice = asNumber(filters.minPrice);
  const maxPrice = asNumber(filters.maxPrice);
  const minRating = asNumber(filters.minRating) ?? 0;

  return products.filter((product) => {
    const inSearch =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const inCategory = filters.category === 'all' || product.category === filters.category;
    const inMinPrice = minPrice === null || product.price >= minPrice;
    const inMaxPrice = maxPrice === null || product.price <= maxPrice;
    const inRating = product.rating >= minRating;

    const inStock =
      filters.stockStatus === 'all' ||
      (filters.stockStatus === 'in-stock' && product.stock > 0) ||
      (filters.stockStatus === 'out-of-stock' && product.stock <= 0);

    return inSearch && inCategory && inMinPrice && inMaxPrice && inRating && inStock;
  });
}

export function sortProducts(products: Product[], sortBy: SortBy): Product[] {
  if (sortBy === 'default') {
    return products;
  }

  const sorted = [...products];

  if (sortBy === 'price-asc') {
    return sorted.sort((a, b) => a.price - b.price);
  }

  if (sortBy === 'price-desc') {
    return sorted.sort((a, b) => b.price - a.price);
  }

  return sorted.sort((a, b) => b.rating - a.rating);
}

export function paginateProducts(products: Product[], page: number, size = PAGE_SIZE): Product[] {
  const start = (page - 1) * size;
  return products.slice(start, start + size);
}
