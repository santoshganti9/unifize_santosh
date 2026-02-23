import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_FILTERS } from '@/lib/catalog';
import { fetchProducts } from '@/services/productService';
import type { Product, ProductFilters, SavedFilter } from '@/types/product';

type CatalogState = {
  products: Product[];
  loading: boolean;
  error: string;
  filters: ProductFilters;
  currentPage: number;
  savedFilters: SavedFilter[];
};

const SAVED_FILTERS_KEY = 'catalog-saved-filters';

function readSavedFilters(): SavedFilter[] {
  try {
    const raw = window.localStorage.getItem(SAVED_FILTERS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedFilter[]) : [];
  } catch {
    return [];
  }
}

function writeSavedFilters(savedFilters: SavedFilter[]) {
  try {
    window.localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(savedFilters));
  } catch {
    // Ignore storage errors (private mode / quota)
  }
}

const initialState: CatalogState = {
  products: [],
  loading: true,
  error: '',
  filters: DEFAULT_FILTERS,
  currentPage: 1,
  savedFilters: readSavedFilters()
};

export const loadProducts = createAsyncThunk('catalog/loadProducts', async () => {
  return fetchProducts();
});

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setFilter: <K extends keyof ProductFilters>(
      state: CatalogState,
      action: PayloadAction<{ key: K; value: ProductFilters[K] }>
    ) => {
      state.filters[action.payload.key] = action.payload.value;
      state.currentPage = 1;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = DEFAULT_FILTERS;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload);
    },
    saveCurrentFilter: (state, action: PayloadAction<string>) => {
      const trimmed = action.payload.trim();
      if (!trimmed) {
        return;
      }

      const saved: SavedFilter = {
        id: `saved-${Date.now()}`,
        name: trimmed,
        filters: state.filters
      };

      state.savedFilters.unshift(saved);
      writeSavedFilters(state.savedFilters);
    },
    applySavedFilter: (state, action: PayloadAction<string>) => {
      const match = state.savedFilters.find((item) => item.id === action.payload);
      if (!match) {
        return;
      }

      state.filters = match.filters;
      state.currentPage = 1;
    },
    removeSavedFilter: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter((item) => item.id !== action.payload);
      writeSavedFilters(state.savedFilters);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(loadProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Unable to load products right now. Please try again.';
      });
  }
});

export const {
  setFilter,
  setFilters,
  clearFilters,
  setCurrentPage,
  saveCurrentFilter,
  applySavedFilter,
  removeSavedFilter
} = catalogSlice.actions;

export const catalogReducer = catalogSlice.reducer;
