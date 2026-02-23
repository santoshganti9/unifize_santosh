import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-3">
        <nav
          className="flex items-center justify-center gap-4"
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            disabled={page <= 1}
            aria-label="Go to previous page"
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span
            className="text-sm font-semibold text-muted-foreground"
            aria-live="polite"
          >
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            aria-label="Go to next page"
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
}
