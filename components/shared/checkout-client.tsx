"use client";

import { useState, useEffect } from "react";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shared/cart-provider";
import { useGeolocation } from "@/hooks/use-geolocation";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import type { Address } from "@/types";

export const CheckoutClient = ({
  addresses,
  previewMode = false,
}: {
  addresses: Address[];
  previewMode?: boolean;
}) => {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const { city, state: geoState, loading: geoLoading, detectLocation, error: geoError, formattedAddress } = useGeolocation();
  const [gateway] = useState<"cod">("cod");
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDetectLocation = async () => {
    await detectLocation();
  };

  // Show toast when location is detected
  useEffect(() => {
    if (formattedAddress) {
      toast({
        title: "Location Detected",
        description: `We found your location: ${formattedAddress}. Please ensure your saved address matches or add a new one.`,
      });
    }
    if (geoError) {
      toast({
        title: "Location Error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [formattedAddress, geoError, toast]);

  const onCheckout = async () => {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        addressId,
        gateway,
      }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Unable to start checkout.");
      return;
    }

    if (payload.data?.status === "pending_configuration") {
      setMessage(payload.data.payment.message);
      return;
    }

    clearCart();
    setMessage("Order confirmed! We'll begin preparing your wellness essentials shortly.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-card space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-headline text-2xl font-bold text-primary">Finalize Order</h2>
          <p className="text-secondary/60 text-sm">Review your delivery details and items to complete your order.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest font-label">Delivery Address</label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLoading}
              className="group flex items-center gap-1.5 text-xs font-bold text-primary transition hover:text-primary/80 disabled:opacity-50"
            >
              <MapPin className={cn("h-3.5 w-3.5", geoLoading && "animate-pulse")} />
              {geoLoading ? "Detecting..." : "Detect My Location"}
            </button>
          </div>
          {addresses.length > 0 ? (
            <select
              value={addressId}
              onChange={(event) => setAddressId(event.target.value)}
              className="h-12 w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 font-body text-sm font-medium shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label}: {address.line1}, {address.city}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-sm text-secondary mb-4">No addresses found in your profile.</p>
              <Button variant="outline" size="sm" asChild className="rounded-full border-primary/20 text-primary hover:bg-primary/5">
                <a href="/profile">Add Delivery Address</a>
              </Button>
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-secondary-container/20 border border-secondary-container/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-wide">Cash on Delivery</p>
              <p className="text-xs text-secondary/70">Pay easily when you receive your package.</p>
            </div>
          </div>
        </div>
      </div>

      <aside className="glass-card space-y-6 p-6 sm:p-8">
        <h2 className="font-headline text-2xl font-bold text-primary">Overview</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between items-start gap-4 pb-3 border-b border-outline-variant/10">
              <div className="flex-1">
                <p className="text-sm font-bold text-primary leading-tight lowercase first-letter:uppercase">{item.name}</p>
                <p className="text-[10px] text-secondary/60 font-bold tracking-widest uppercase mt-1">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold font-headline text-primary whitespace-nowrap">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 text-primary">
          <div className="flex justify-between text-lg font-bold">
            <span className="font-headline">Total Amount</span>
            <span className="font-headline text-2xl">Rs. {items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
          </div>
        </div>

        <Button
          className="w-full h-14 rounded-full bg-primary text-white text-xs uppercase tracking-widest font-bold hover:bg-primary/90 shadow-[0px_8px_24px_rgba(28,28,22,0.15)] transition-all active:scale-95"
          disabled={loading || !items.length || !addressId}
          onClick={onCheckout}
        >
          {loading ? "Confirming Order..." : "Confirm Order"}
        </Button>
        {message ? (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-xs font-medium text-primary leading-relaxed">{message}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
};
