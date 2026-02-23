import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogToolbar } from "@/components/catalog/catalogToolbar";
import { FilterSidebar } from "@/components/catalog/filterSidebar";
import { Pagination } from "@/components/catalog/pagination";
import { ProductGrid } from "@/components/catalog/productGrid";
import { useCatalogView } from "@/hooks/useCatalogView";
import { DEFAULT_FILTERS } from "@/lib/catalog";
import {
  buildCatalogSearchParams,
  parseCatalogUrlState,
} from "@/lib/catalogUrlState";
import {
  applySavedFilter,
  clearFilters,
  loadProducts,
  removeSavedFilter,
  saveCurrentFilter,
  setCurrentPage,
  setFilters,
} from "@/store/catalogSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { SortBy } from "@/types/product";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.catalog.filters);
  const loading = useAppSelector((state) => state.catalog.loading);
  const error = useAppSelector((state) => state.catalog.error);
  const currentPage = useAppSelector((state) => state.catalog.currentPage);
  const savedFilters = useAppSelector((state) => state.catalog.savedFilters);

  const [sortBy, setSortBy] = useState<SortBy>("default");
  const { categories, paginated, totalCount, totalPages, visibleCount } =
    useCatalogView(sortBy);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [isUrlHydrated, setIsUrlHydrated] = useState(false);

  useEffect(() => {
    void dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isUrlHydrated) {
      return;
    }

    const initialState = parseCatalogUrlState(searchParams);
    dispatch(setFilters(initialState.filters));
    setSortBy(initialState.sortBy);
    dispatch(setCurrentPage(initialState.page));
    setIsUrlHydrated(true);
  }, [dispatch, isUrlHydrated, searchParams]);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (currentPage > totalPages) {
      dispatch(setCurrentPage(totalPages));
    }
  }, [currentPage, dispatch, totalPages]);

  useEffect(() => {
    if (!isUrlHydrated) {
      return;
    }

    const nextParams = buildCatalogSearchParams(
      filters,
      sortBy,
      currentPage,
      searchParams,
    );
    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    filters,
    sortBy,
    currentPage,
    isUrlHydrated,
    searchParams,
    setSearchParams,
  ]);

  const handleApply = () => {
    dispatch(setFilters(draftFilters));
  };

  const handleClear = () => {
    setDraftFilters(DEFAULT_FILTERS);
    dispatch(clearFilters());
  };

  return (
    <div className="min-h-screen py-5">
      <div className="container grid gap-4 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          categories={categories}
          filters={draftFilters}
          savedFilters={savedFilters}
          onFilterChange={(key, value) =>
            setDraftFilters((previous) => ({ ...previous, [key]: value }))
          }
          onApply={handleApply}
          onClear={handleClear}
          onSaveFilter={(name) => {
            const trimmed = name.trim();
            if (!trimmed) {
              return false;
            }
            dispatch(setFilters(draftFilters));
            dispatch(saveCurrentFilter(trimmed));
            return true;
          }}
          onApplySavedFilter={(id) => dispatch(applySavedFilter(id))}
          onDeleteSavedFilter={(id) => dispatch(removeSavedFilter(id))}
        />

        <main className="space-y-4">
          <CatalogToolbar
            search={draftFilters.searchTerm}
            sortBy={sortBy}
            page={currentPage}
            visibleCount={visibleCount}
            totalCount={totalCount}
            onSearchChange={(value) => {
              setDraftFilters((previous) => ({
                ...previous,
                searchTerm: value,
              }));
            }}
            onSearchSubmit={handleApply}
            onSortChange={setSortBy}
          />

          <ProductGrid loading={loading} error={error} products={paginated} />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        </main>
      </div>
    </div>
  );
}
