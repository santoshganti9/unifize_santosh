import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  product: Product;
  onPreview: (product: Product) => void;
};

export function ProductCard({ product, onPreview }: Props) {
  return (
    <button
      type="button"
      onClick={() => onPreview(product)}
      className="w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2"
      aria-label={`Preview ${product.title}`}
    >
      <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="aspect-[4/3] bg-muted">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="space-y-2">
          <Badge>{product.category}</Badge>
          <h3 className="line-clamp-1 text-base font-semibold">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </p>
            <p className="flex items-center gap-1 text-sm font-semibold text-warning">
              <Star className="h-4 w-4 fill-warning" />{" "}
              {product.rating.toFixed(2)}
            </p>
          </div>
          <p
            className={
              product.stock > 0
                ? "text-sm font-semibold text-success"
                : "text-sm font-semibold text-danger"
            }
          >
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
