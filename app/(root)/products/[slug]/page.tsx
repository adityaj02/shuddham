import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSession } from "@/lib/auth";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { ProductCard } from "@/components/shared/product-card";
import { ReviewList } from "@/components/shared/review-list";
import { ReviewForm } from "@/components/products/review-form";
import {
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
} from "@/lib/services/products";
import { formatCurrency } from "@/lib/utils";

const ProductDetailsPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const session = await getSession();
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product),
  ]);

  const stars = Math.floor(product.rating);
  const hasHalf = product.rating - stars >= 0.5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* ─── Product Hero ────────────────────────────────────────────── */}
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low group">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Tag badge */}
          {product.tags?.[0] && (
            <div className="absolute top-6 left-6 bg-surface-container-lowest/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                {product.tags[0].replace(/-/g, " ")}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8 lg:sticky lg:top-28">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium truncate">{product.name}</span>
          </div>

          {/* Title + Price */}
          <div className="space-y-4">
            <h1 className="font-headline text-4xl md:text-5xl text-primary leading-tight">{product.name}</h1>
            <p className="text-on-surface-variant text-lg">{product.subtitle}</p>

            <div className="flex flex-wrap items-end gap-4 pt-2">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price, product.currency)}
              </span>
              {product.compareAtPrice ? (
                <span className="text-lg text-outline line-through">
                  {formatCurrency(product.compareAtPrice, product.currency)}
                </span>
              ) : null}
              <span className="text-[10px] text-on-secondary-fixed-variant bg-secondary-container px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-tertiary">
              {Array.from({ length: stars }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-base filled-icon">star</span>
              ))}
              {hasHalf && (
                <span className="material-symbols-outlined text-base">star_half</span>
              )}
            </div>
            <span className="text-sm font-bold text-primary">{product.rating}</span>
            <span className="text-sm text-outline-variant">({product.reviewCount} reviews)</span>
          </div>

          {/* Description */}
          <p className="text-on-surface-variant text-base leading-relaxed">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] text-on-secondary-fixed-variant bg-secondary-container px-3 py-1 rounded-full uppercase tracking-widest font-medium"
              >
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>

          {/* Add to Cart */}
          <div className="pt-4">
            <AddToCartButton
              product={product}
              className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-all duration-300 shadow-[0px_20px_40px_rgba(28,28,22,0.06)]"
              label="Add to Ritual"
              icon="add_shopping_cart"
            />
          </div>

          {/* Certifications */}
          {product.certifications.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 pt-4 border-t border-outline-variant/20">
              {product.certifications.map((item: string) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span className="text-sm font-medium text-primary">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Product Details + Highlights ─────────────────────────────── */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Metadata */}
        {Object.keys(product.metadata).length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="font-headline text-2xl text-primary">Product Details</h2>
            <div className="space-y-4">
              {Object.entries(product.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-outline-variant/20 pb-3 text-sm">
                  <span className="font-semibold capitalize text-on-surface">{key}</span>
                  <span className="text-on-surface-variant">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Highlights */}
        {product.nutritionHighlights.length > 0 && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-8">
              <h2 className="font-headline text-2xl text-primary mb-6">Why Customers Buy It</h2>
              <div className="grid gap-3">
                {product.nutritionHighlights.map((item: string) => (
                  <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-tertiary text-lg">eco</span>
                    <span className="text-sm text-on-surface">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── Reviews ─────────────────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-outline-variant/10 pb-8">
          <div className="space-y-2">
            <span className="text-tertiary-fixed-dim text-xs tracking-[0.3em] font-bold uppercase opacity-50">Community Rituals</span>
            <h2 className="font-headline text-4xl text-primary font-bold">Ratings & Reviews</h2>
          </div>
          <ReviewForm productId={product.id} userId={session.userId} />
        </div>
        <ReviewList reviews={reviews} />
      </section>

      {/* ─── Related Products ────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-tertiary-fixed-dim text-xs tracking-widest font-bold uppercase">You May Also Like</span>
            <h2 className="font-headline text-3xl text-primary">Complete Your Ritual</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} variant="catalog" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
