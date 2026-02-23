import { DEFAULT_FILTERS } from "@/lib/catalog";
import type { ProductFilters, SortBy } from "@/types/product";

const STOCK_STATUS_VALUES: ProductFilters["stockStatus"][] = [
  "all",
  "in-stock",
  "out-of-stock",
];

const SORT_VALUES: SortBy[] = [
  "default",
  "price-asc",
  "price-desc",
  "rating-desc",
];

type CatalogUrlState = {
  filters: ProductFilters;
  sortBy: SortBy;
  page: number;
};

export function parseCatalogUrlState(params: URLSearchParams): CatalogUrlState {
  const stockStatus = params.get("stock");
  const sortBy = params.get("sort");

  const filters: ProductFilters = {
    searchTerm: params.get("search") ?? DEFAULT_FILTERS.searchTerm,
    category: params.get("category") ?? DEFAULT_FILTERS.category,
    minPrice: params.get("minPrice") ?? DEFAULT_FILTERS.minPrice,
    maxPrice: params.get("maxPrice") ?? DEFAULT_FILTERS.maxPrice,
    minRating: params.get("minRating") ?? DEFAULT_FILTERS.minRating,
    stockStatus: STOCK_STATUS_VALUES.includes(
      stockStatus as ProductFilters["stockStatus"],
    )
      ? (stockStatus as ProductFilters["stockStatus"])
      : DEFAULT_FILTERS.stockStatus,
  };

  const parsedSortBy = SORT_VALUES.includes(sortBy as SortBy)
    ? (sortBy as SortBy)
    : "default";

  const rawPage = Number(params.get("page") ?? "1");
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.trunc(rawPage) : 1;

  return { filters, sortBy: parsedSortBy, page };
}

export function buildCatalogSearchParams(
  filters: ProductFilters,
  sortBy: SortBy,
  page: number,
  currentParams: URLSearchParams,
) {
  const params = new URLSearchParams(currentParams);
  const managedKeys = [
    "search",
    "category",
    "minPrice",
    "maxPrice",
    "minRating",
    "stock",
    "sort",
    "page",
  ];

  managedKeys.forEach((key) => params.delete(key));

  if (filters.searchTerm) {
    params.set("search", filters.searchTerm);
  }
  if (filters.category !== DEFAULT_FILTERS.category) {
    params.set("category", filters.category);
  }
  if (filters.minPrice) {
    params.set("minPrice", filters.minPrice);
  }
  if (filters.maxPrice) {
    params.set("maxPrice", filters.maxPrice);
  }
  if (filters.minRating !== DEFAULT_FILTERS.minRating) {
    params.set("minRating", filters.minRating);
  }
  if (filters.stockStatus !== DEFAULT_FILTERS.stockStatus) {
    params.set("stock", filters.stockStatus);
  }
  if (sortBy !== "default") {
    params.set("sort", sortBy);
  }
  if (page > 1) {
    params.set("page", String(page));
  }

  return params;
}
