import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * ProductCard — supports two visual variants:
 *  "catalog" (default): full-bleed card from the shop grid
 *  "carousel": compact card for horizontal scroll sections
 */
export const ProductCard = ({
  product,
  variant = "catalog",
}: {
  product: Product;
  variant?: "catalog" | "carousel";
}) => {
  /* Tag badge — pick first tag and humanize */
  const primaryTag = product.tags?.[0]?.replace(/-/g, " ") ?? null;
  const secondaryTag = product.tags?.[1]?.replace(/-/g, " ") ?? null;

  if (variant === "carousel") {
    return (
      <div className="flex-none w-72 md:w-80 snap-start">
        <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 soft-elevation group relative border border-outline-variant/10">
          {/* Tags */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-primary/90 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Image */}
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={320}
                height={400}
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Link>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-gold">
                {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                {product.rating - Math.floor(product.rating) >= 0.5 && (
                  <span className="material-symbols-outlined text-xs">star_half</span>
                )}
              </div>
              <span className="text-[10px] text-outline font-medium">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <h4 className="font-headline text-lg text-primary mb-1">{product.name}</h4>
            <p className="text-secondary/60 text-xs mb-4 line-clamp-2 italic">
              &ldquo;{product.shortDescription}&rdquo;
            </p>

            <div className="flex justify-between items-center mt-auto">
              <div>
                <span className="text-primary font-bold text-lg">
                  {formatCurrency(product.price, product.currency)}
                </span>
                {product.compareAtPrice ? (
                  <span className="text-outline text-xs line-through ml-2">
                    {formatCurrency(product.compareAtPrice, product.currency)}
                  </span>
                ) : null}
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ————————————— catalog variant (new default for shop grid) ————————————— */
  return (
    <div className="group space-y-4">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Badge */}
          {primaryTag && (
            <div className="absolute top-4 left-4 bg-surface-container-lowest/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                {primaryTag}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 min-w-0 flex-1 mr-4">
            <Link href={`/products/${product.slug}`}>
              <h4 className="font-headline text-xl text-primary hover:opacity-80 transition-opacity truncate">
                {product.name}
              </h4>
            </Link>
            <p className="text-on-surface-variant text-sm line-clamp-1">{product.shortDescription}</p>
          </div>
          <span className="font-bold text-lg shrink-0">
            {formatCurrency(product.price, product.currency)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-tertiary">
          <span className="material-symbols-outlined text-sm filled-icon">star</span>
          <span className="text-xs font-bold">{product.rating}</span>
          <span className="text-xs text-outline-variant ml-1">({product.reviewCount} reviews)</span>
        </div>

        {/* Tags + Add Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-on-secondary-fixed-variant bg-secondary-container px-2 py-0.5 rounded-full uppercase tracking-tighter font-medium truncate max-w-[180px]">
            {[primaryTag, secondaryTag].filter(Boolean).join(" • ")}
          </span>
          <AddToCartButton
            product={product}
            className="bg-primary text-white w-10 h-10 rounded-full px-0 py-0 hover:scale-105 transition-transform duration-300"
            label=""
            icon="add"
          />
        </div>
      </div>
    </div>
  );
};
