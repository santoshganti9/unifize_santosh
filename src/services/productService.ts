import rawCatalog from '@/utils/products.json';
import type { Product, RawProduct } from '@/types/product';

const SIMULATED_DELAY = 650;

type CatalogPayload = {
  products: RawProduct[];
};

function normalizeCategory(category: string): string {
  return category
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapProducts(payload: CatalogPayload): Product[] {
  return payload.products.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: normalizeCategory(item.category),
    price: item.price,
    rating: item.rating,
    stock: item.stock,
    thumbnail: item.thumbnail ?? item.images?.[0] ?? ''
  }));
}

export async function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(mapProducts(rawCatalog as CatalogPayload));
    }, SIMULATED_DELAY);
  });
}
