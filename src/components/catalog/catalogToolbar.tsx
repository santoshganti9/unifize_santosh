import { Search } from "lucide-react";
import { PAGE_SIZE, SORT_OPTIONS } from "@/lib/catalog";
import type { SortBy } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  search: string;
  sortBy: SortBy;
  page: number;
  visibleCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSortChange: (value: SortBy) => void;
};

export function CatalogToolbar({
  search,
  sortBy,
  page,
  visibleCount,
  totalCount,
  onSearchChange,
  onSearchSubmit,
  onSortChange,
}: Props) {
  const searchId = "catalog-search";
  const sortId = "catalog-sort";
  const start = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end =
    totalCount === 0 ? 0 : Math.min(totalCount, start + visibleCount - 1);

  return (
    <>
      <Card>
        <CardContent>
          <form
            className="flex flex-col gap-3 p-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              onSearchSubmit();
            }}
            aria-label="Product search"
          >
            <div className="relative flex-1">
              <label htmlFor={searchId} className="sr-only">
                Search products
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id={searchId}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
            <Button type="submit" className="sm:w-32">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
          <p
            className="text-sm font-semibold text-muted-foreground"
            aria-live="polite"
          >
            Showing {start}-{end} of {totalCount} products
          </p>
          <label htmlFor={sortId} className="sr-only">
            Sort products
          </label>
          <Select
            id={sortId}
            className="w-full sm:w-56"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>
    </>
  );
}
