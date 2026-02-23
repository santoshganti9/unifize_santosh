import { describe, expect, it } from 'vitest';
import { filterProducts, sortProducts } from '@/lib/catalog';
import type { Product } from '@/types/product';

const products: Product[] = [
  {
    id: 1,
    title: 'Alpha Phone',
    description: 'Fast phone',
    category: 'Electronics',
    price: 300,
    rating: 4.8,
    stock: 12,
    thumbnail: 'x'
  },
  {
    id: 2,
    title: 'Bravo Serum',
    description: 'Hydrating skincare',
    category: 'Beauty',
    price: 25,
    rating: 4.2,
    stock: 0,
    thumbnail: 'x'
  },
  {
    id: 3,
    title: 'Charlie Lamp',
    description: 'Warm light decor',
    category: 'Home',
    price: 80,
    rating: 3.9,
    stock: 6,
    thumbnail: 'x'
  }
];

describe('catalog utilities', () => {
  it('filters by search/category/stock', () => {
    const filtered = filterProducts(products, {
      searchTerm: 'phone',
      category: 'Electronics',
      minPrice: '',
      maxPrice: '',
      minRating: '4',
      stockStatus: 'in-stock'
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it('filters by price range and minimum rating', () => {
    const filtered = filterProducts(products, {
      searchTerm: '',
      category: 'all',
      minPrice: '50',
      maxPrice: '120',
      minRating: '3.5',
      stockStatus: 'all'
    });

    expect(filtered.map((item) => item.id)).toEqual([3]);
  });

  it('filters out-of-stock products', () => {
    const filtered = filterProducts(products, {
      searchTerm: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      minRating: '0',
      stockStatus: 'out-of-stock'
    });

    expect(filtered.map((item) => item.id)).toEqual([2]);
  });

  it('sorts by descending price', () => {
    const sorted = sortProducts(products, 'price-desc');
    expect(sorted.map((item) => item.id)).toEqual([1, 3, 2]);
  });

  it('sorts by ascending price', () => {
    const sorted = sortProducts(products, 'price-asc');
    expect(sorted.map((item) => item.id)).toEqual([2, 3, 1]);
  });

  it('sorts by descending rating', () => {
    const sorted = sortProducts(products, 'rating-desc');
    expect(sorted.map((item) => item.id)).toEqual([1, 2, 3]);
  });
});
