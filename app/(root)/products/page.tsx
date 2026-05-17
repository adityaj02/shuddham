import Link from "next/link";
import Image from "next/image";

import { ProductCard } from "@/components/shared/product-card";
import { getCategories, getProducts, getFeaturedProducts } from "@/lib/services/products";
import { formatCurrency } from "@/lib/utils";

/* Category icon mapping – gives each category a Material Symbol icon */
const categoryIcons: Record<string, string> = {
  "herbal-teas": "emoji_food_beverage",
  "immunity-health": "health_and_safety",
  "mental-wellness": "psychology",
  "skin-beauty": "face",
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { category?: string; query?: string };
}) => {
  const [products, categories, featuredProducts] = await Promise.all([
    getProducts({
      category: searchParams.category,
      search: searchParams.query,
    }),
    getCategories(),
    getFeaturedProducts(),
  ]);

  const filteredProducts = products;

  /* Pick two featured products for the bento seasonal section */
  const bentoMain = featuredProducts[0] ?? null;
  const bentoSide = featuredProducts[1] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* ─── Hero Catalog Block ─────────────────────────────────────── */}
      <section className="relative rounded-xl overflow-hidden min-h-[450px] flex items-center bg-surface-container-low">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-transparent to-transparent z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
            alt="Close-up of vibrant green palm leaves with soft natural sunlight filtering through"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZMUx9YTb81fVuvtbZbLbgIouLOTFtlOX6CkUpl4L5t7GHPevmiI_mTuGHUvXOI26WPx9i5GJEwdayN3p4rb6-a4xuDQbsVVaiVWYjYUBNv46DenYJy2OI3GdoUkSMgG-JuYSmSS6uWg4TGAVDNZ8Qt-SRBDjiLEPd66C6yAlzCeGV6z3Q9A-1FQipQZA8EvHADLRCtzgXLKJzZ30E024t2dNfusvDhyAbigAx7K2zAOheFDTBH1_xWnXlfCAxcPYyontgmwizbTU"
          />
        </div>
        <div className="relative z-20 px-8 md:px-16 max-w-2xl space-y-6">
          <span className="font-label text-xs tracking-[0.2em] uppercase text-primary font-bold">CATALOG</span>
          <h2 className="font-headline text-5xl md:text-6xl text-primary leading-tight">
            Organic products for modern rituals
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            Elevate your daily self-care with our curator-selected Ayurvedic essentials, crafted for potency and mindful living.
          </p>
          <div className="pt-4">
            <Link
              href="#shop-grid"
              className="bg-primary text-white px-8 py-3 rounded-xl font-label text-sm uppercase tracking-widest hover:opacity-90 transition-all duration-300 shadow-[0px_20px_40px_rgba(28,28,22,0.06)] inline-block"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Search & Filter Bar ────────────────────────────────────── */}
      <div id="shop-grid" className="sticky top-20 z-40 space-y-6 bg-surface/90 backdrop-blur-md py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <form className="relative max-w-3xl mx-auto" action="/products" method="GET">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
          <input
            className="w-full bg-surface-container-lowest border-none h-14 pl-14 pr-14 rounded-full text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline-variant shadow-sm transition-all duration-300"
            placeholder="Search rituals, herbs, products..."
            type="text"
            name="query"
            defaultValue={searchParams.query}
          />
          {searchParams.category && (
            <input type="hidden" name="category" value={searchParams.category} />
          )}
          <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-primary transition-colors">
            search
          </button>
        </form>

        {/* Smart Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          <Link
            href="/products"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap shadow-sm transition-colors ${
              !searchParams.category
                ? "bg-primary text-white"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="font-label text-xs uppercase tracking-wider font-bold">All</span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                searchParams.category === category.slug
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {categoryIcons[category.slug] ?? "spa"}
              </span>
              <span className="font-label text-xs uppercase tracking-wider">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Recommended / Main Product Grid ────────────────────────── */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-tertiary-fixed-dim text-xs tracking-widest font-bold uppercase">Curated</span>
            <h3 className="font-headline text-3xl text-primary">
              {searchParams.category
                ? categories.find((c) => c.slug === searchParams.category)?.name ?? "Products"
                : searchParams.query
                ? `Results for "${searchParams.query}"`
                : "Recommended for You"}
            </h3>
          </div>
          {(searchParams.category || searchParams.query) && (
            <Link
              href="/products"
              className="text-primary text-sm font-medium underline underline-offset-8 decoration-outline-variant hover:decoration-primary transition-all"
            >
              Clear Filters
            </Link>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">search_off</span>
            <p className="text-on-surface-variant text-lg">No products match your filters.</p>
            <Link href="/products" className="inline-block mt-4 text-primary underline underline-offset-4 text-sm font-medium">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="catalog" />
            ))}
          </div>
        )}
      </section>

      {/* ─── Seasonal Essentials (Bento Grid) ───────────────────────── */}
      {bentoMain && bentoSide && !searchParams.category && !searchParams.query && (
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-tertiary-fixed-dim text-xs tracking-widest font-bold uppercase">Timely Care</span>
            <h3 className="font-headline text-3xl text-primary">Seasonal Essentials</h3>
          </div>
          <div className="asymmetric-grid">
            {/* Large Feature */}
            <Link href={`/products/${bentoMain.slug}`} className="bento-card-wide bg-surface-container relative rounded-xl overflow-hidden p-8 md:p-12 flex flex-col justify-end min-h-[400px] group block">
              <Image
                src={bentoMain.images[0]}
                alt={bentoMain.name}
                fill
                className="object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="relative z-10 space-y-4 max-w-sm">
                <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-primary">
                  {bentoMain.isFeatured ? "Featured" : "Limited Edition"}
                </span>
                <h4 className="font-headline text-4xl text-primary">{bentoMain.name}</h4>
                <p className="text-on-surface text-base line-clamp-2">{bentoMain.shortDescription}</p>
                <div className="pt-2">
                  <span className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-label uppercase tracking-widest inline-flex items-center gap-2">
                    Shop Now • {formatCurrency(bentoMain.price, bentoMain.currency)}
                  </span>
                </div>
              </div>
            </Link>
            {/* Small Feature */}
            <Link href={`/products/${bentoSide.slug}`} className="bento-card-tall bg-surface-container-high rounded-xl overflow-hidden flex flex-col group block">
              <div className="h-1/2 overflow-hidden relative">
                <Image
                  src={bentoSide.images[0]}
                  alt={bentoSide.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-headline text-2xl text-primary">{bentoSide.name}</h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{bentoSide.shortDescription}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatCurrency(bentoSide.price, bentoSide.currency)}</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">east</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ─── Popular Section (Community Favorites) ──────────────────── */}
      {!searchParams.category && !searchParams.query && featuredProducts.length > 2 && (
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-tertiary-fixed-dim text-xs tracking-widest font-bold uppercase">Community Favorites</span>
              <h3 className="font-headline text-3xl text-primary">Popular in Ayurveda</h3>
            </div>
            <Link
              href="/products"
              className="text-primary text-sm font-medium underline underline-offset-8 decoration-outline-variant hover:decoration-primary transition-all"
            >
              Discover More
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(2, 6).map((product) => (
              <div key={product.id} className="bg-surface-container-lowest p-4 rounded-xl space-y-4 hover:shadow-lg transition-all duration-300 group">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="aspect-square rounded-lg overflow-hidden relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="space-y-1">
                  <Link href={`/products/${product.slug}`}>
                    <h5 className="font-headline text-lg text-primary hover:opacity-80 transition-opacity truncate">{product.name}</h5>
                  </Link>
                  <p className="text-xs text-on-surface-variant font-medium line-clamp-1">{product.subtitle}</p>
                  <p className="text-sm font-bold pt-1">{formatCurrency(product.price, product.currency)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductsPage;
