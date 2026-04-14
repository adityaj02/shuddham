"use client";

import { useCart } from "@/components/shared/cart-provider";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export const AddToCartButton = ({ 
  product, 
  className, 
  label = "Quick Add",
  icon = "add_shopping_cart"
}: { 
  product: Product;
  className?: string;
  label?: string;
  icon?: string | null;
}) => {
  const { addItem } = useCart();

  return (
    <button
      className={cn(
        "bg-primary text-white px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          quantity: 1,
          stock: product.stock,
        });
      }}
    >
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
      {label}
    </button>
  );
};
