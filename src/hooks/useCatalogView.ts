import { useMemo } from 'react';
import {
  extractCategories,
  filterProducts,
  paginateProducts,
  sortProducts
} from '@/lib/catalog';
import type { SortBy } from '@/types/product';
import { useAppSelector } from '@/store/hooks';

export function useCatalogView(sortBy: SortBy) {
  const products = useAppSelector((state) => state.catalog.products);
  const filters = useAppSelector((state) => state.catalog.filters);
  const currentPage = useAppSelector((state) => state.catalog.currentPage);

  const categories = useMemo(() => extractCategories(products), [products]);

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);

  const sorted = useMemo(() => sortProducts(filtered, sortBy), [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 12));
  const paginated = useMemo(() => paginateProducts(sorted, currentPage), [sorted, currentPage]);

  return {
    categories,
    paginated,
    totalCount: filtered.length,
    visibleCount: paginated.length,
    totalPages
  };
}
