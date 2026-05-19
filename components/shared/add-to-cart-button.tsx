"use client";

import { useState } from "react";
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
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.primaryImage || '',
      price: product.price,
      quantity: 1,
      stock: product.stock,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <button
      type="button"
      className={cn(
        "bg-primary text-white px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-primary/85 active:scale-95 transition-all duration-200 relative z-20 cursor-pointer select-none",
        isAdded && "bg-green-700 scale-95",
        className
      )}
      onClick={handleClick}
    >
      {isAdded ? (
        <>
          <span className="material-symbols-outlined text-sm">check</span>
          {label && "Added!"}
        </>
      ) : (
        <>
          {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
};
