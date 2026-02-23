import { useState } from "react";
import { DEFAULT_FILTERS, STOCK_OPTIONS } from "@/lib/catalog";
import type { ProductFilters, SavedFilter } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const parseIntegerInput = (value: string) => {
  if (value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return "";
  }

  return String(Math.max(0, Math.trunc(parsed)));
};

type Props = {
  categories: string[];
  filters: ProductFilters;
  savedFilters: SavedFilter[];
  onFilterChange: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => void;
  onApply: () => void;
  onClear: () => void;
  onSaveFilter: (name: string) => boolean;
  onApplySavedFilter: (id: string) => void;
  onDeleteSavedFilter: (id: string) => void;
};

export function FilterSidebar({
  categories,
  filters,
  savedFilters,
  onFilterChange,
  onApply,
  onClear,
  onSaveFilter,
  onApplySavedFilter,
  onDeleteSavedFilter,
}: Props) {
  const [name, setName] = useState("");
  const categoryId = "filter-category";
  const minPriceId = "filter-min-price";
  const maxPriceId = "filter-max-price";
  const minRatingId = "filter-min-rating";
  const stockStatusId = "filter-stock-status";
  const saveFilterNameId = "save-filter-name";

  const handleMinPriceChange = (raw: string) => {
    const nextMin = parseIntegerInput(raw);
    onFilterChange("minPrice", nextMin);

    if (!nextMin || !filters.maxPrice) {
      return;
    }

    const min = Number(nextMin);
    const max = Number(filters.maxPrice);

    if (Number.isFinite(min) && Number.isFinite(max) && min >= max) {
      onFilterChange("maxPrice", String(min + 1));
    }
  };

  const handleMaxPriceChange = (raw: string) => {
    const nextMax = parseIntegerInput(raw);
    onFilterChange("maxPrice", nextMax);

    if (!nextMax || !filters.minPrice) {
      return;
    }

    const max = Number(nextMax);
    const min = Number(filters.minPrice);

    if (Number.isFinite(min) && Number.isFinite(max) && max <= min) {
      onFilterChange("minPrice", String(Math.max(0, max - 1)));
    }
  };

  const handleSave = () => {
    if (onSaveFilter(name)) {
      setName("");
    }
  };

  return (
    <aside
      className="space-y-4 lg:sticky lg:top-5 lg:h-fit"
      aria-label="Filters"
    >
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">Filters</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={categoryId}>
              Category
            </label>
            <Select
              id={categoryId}
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Price Range</legend>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id={minPriceId}
                type="number"
                min="0"
                step="1"
                placeholder="Min"
                aria-label="Minimum price"
                value={filters.minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
              />
              <Input
                id={maxPriceId}
                type="number"
                min="0"
                step="1"
                placeholder="Max"
                aria-label="Maximum price"
                value={filters.maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
              />
            </div>
          </fieldset>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={minRatingId}>
              Minimum Rating
            </label>
            <Select
              id={minRatingId}
              value={filters.minRating}
              onChange={(e) => onFilterChange("minRating", e.target.value)}
            >
              <option value="0">Any Rating</option>
              <option value="1">1+ stars</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={stockStatusId}>
              Stock Status
            </label>
            <Select
              id={stockStatusId}
              value={filters.stockStatus}
              onChange={(e) =>
                onFilterChange(
                  "stockStatus",
                  e.target.value as ProductFilters["stockStatus"],
                )
              }
            >
              {STOCK_OPTIONS.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onApply}>Apply</Button>
            <Button
              variant="outline"
              onClick={() => {
                onClear();
                setName("");
                onFilterChange("searchTerm", DEFAULT_FILTERS.searchTerm);
              }}
            >
              Clear
            </Button>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <Input
              id={saveFilterNameId}
              placeholder="Filter name"
              aria-label="Saved filter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button className="w-full" onClick={handleSave}>
              Save Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-base font-semibold">Saved Filters</h3>
          {savedFilters.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No saved filters yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {savedFilters.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-9 flex-1 justify-start truncate"
                    aria-label={`Apply saved filter ${item.name}`}
                    onClick={() => onApplySavedFilter(item.id)}
                  >
                    {item.name}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 text-danger"
                    aria-label={`Delete saved filter ${item.name}`}
                    onClick={() => onDeleteSavedFilter(item.id)}
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
