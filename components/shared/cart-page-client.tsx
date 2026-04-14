"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shared/cart-provider";
import { calculateCartTotals, formatCurrency } from "@/lib/utils";

export const CartPageClient = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const totals = calculateCartTotals(items);

  if (!items.length) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="font-display text-4xl">Your cart is empty</p>
        <p className="mt-3 section-copy">Add a few essentials to continue to checkout.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl">{item.name}</p>
              <p className="text-sm text-muted-foreground">Premium Ayurvedic Staple</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(item.productId, Number(event.target.value))
                }
                className="h-11 w-20 rounded-full border border-border bg-white px-4 text-center"
              />
              <p className="w-24 text-right font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <Button variant="ghost" onClick={() => removeItem(item.productId)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <aside className="glass-card h-fit space-y-4 p-6">
        <h2 className="font-display text-3xl">Order summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(totals.shippingAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatCurrency(totals.taxAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totals.totalAmount)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="inline-flex w-full justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
};
