import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PackageSearch, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { ProductCard } from "./productCard";

type Props = {
  loading: boolean;
  error: string;
  products: Product[];
};

export function ProductGrid({ loading, error, products }: Props) {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!previewProduct) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewProduct(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewProduct]);

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 animate-fadeInSoft sm:grid-cols-2 xl:grid-cols-4 motion-reduce:animate-none"
        role="status"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="h-[320px] overflow-hidden p-0">
            <div className="h-full animate-pulseSoft">
              <div className="h-44 bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-24 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-7 w-20 rounded bg-muted" />
                  <div className="h-5 w-14 rounded bg-muted" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="animate-fadeInSoft rounded-lg border border-danger/40 bg-red-50 p-4 text-sm text-danger motion-reduce:animate-none">
        {error}
      </p>
    );
  }

  if (!products.length) {
    return (
      <Card className="animate-riseIn p-10 text-center motion-reduce:animate-none">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <PackageSearch className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try broadening your filters or changing search terms.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 animate-riseIn sm:grid-cols-2 xl:grid-cols-4 motion-reduce:animate-none">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPreview={setPreviewProduct}
          />
        ))}
      </div>

      {previewProduct ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewProduct.title} preview`}
          onClick={() => setPreviewProduct(null)}
        >
          <Card
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Close preview"
              className="absolute right-3 top-3 z-10"
              onClick={() => setPreviewProduct(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            <img
              src={previewProduct.thumbnail}
              alt={previewProduct.title}
              className="h-64 w-full object-cover sm:h-80"
            />

            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge>{previewProduct.category}</Badge>
                  <h3 className="mt-2 text-xl font-semibold">
                    {previewProduct.title}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${previewProduct.price.toFixed(2)}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {previewProduct.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-md bg-muted px-2 py-1 font-medium">
                  Rating: {previewProduct.rating.toFixed(2)}
                </span>
                <span
                  className={
                    previewProduct.stock > 0
                      ? "rounded-md bg-success/15 px-2 py-1 font-medium text-success"
                      : "rounded-md bg-danger/15 px-2 py-1 font-medium text-danger"
                  }
                >
                  {previewProduct.stock > 0
                    ? `In stock: ${previewProduct.stock}`
                    : "Out of stock"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
