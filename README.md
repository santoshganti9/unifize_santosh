# Product Catalog UI

Responsive TypeScript product catalog page with local JSON data, client-side filtering, sortable product grid, and persisted saved filters.

## Features

- Async data loading simulation over local JSON source (`src/utils/products.json`).
- Real-time global search by title/description.
- Category, price range, minimum rating, and stock status filters.
- Sort by price (asc/desc) and rating (desc).
- Saved filter presets persisted in localStorage.
- URL state management for filter and pagination.
- Product count summary, pagination, skeleton loading, and empty states.
- Utility tests for filtering/sorting logic via Vitest.

## Tech Stack

- React 19 + TypeScript + Vite
- Redux Toolkit + React Redux (state management + persistence)
- Tailwind CSS
- shadcn/ui-style component primitives (in `src/components/ui`)
- Vitest

## Setup

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Build & Preview

```bash
npm run build
npm run preview
```

## Type Check

```bash
npm run typecheck
```

## Run Tests

```bash
npm run test
```

## Project Structure

```text
src/
  components/
    catalog/
    ui/
  hooks/
    useCatalogView.ts
  lib/
    catalog.ts
    utils.ts
  services/
    productService.ts
  store/
    catalogSlice.ts
    hooks.ts
    store.ts
  types/
    product.ts
  utils/
    products.json
```

## Deployment

This app has been deployed directly on Netlify as a static Vite app.

- Live URL: https://fascinating-semifreddo-3bbeed.netlify.app/

- Build command: `npm run build`
- Output directory: `dist`
