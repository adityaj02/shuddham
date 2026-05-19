"use client";

import { useState, useEffect } from "react";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shared/cart-provider";
import { useGeolocation } from "@/hooks/use-geolocation";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import type { Address, AppUser } from "@/types";

export const CheckoutClient = ({
  addresses,
  user,
  previewMode = false,
}: {
  addresses: Address[];
  user: AppUser | null;
  previewMode?: boolean;
}) => {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  
  const [clientAddresses, setClientAddresses] = useState<Address[]>(addresses);
  const [gateway] = useState<"cod">("cod");
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Address>>({});

  const handleDetectLocation = async () => {
    setGeoLoading(true);
    try {
      // 1. Get coords
      const { getCurrentCoordinates, reverseGeocode } = await import("@/lib/utils/location");
      const coords = await getCurrentCoordinates();
      
      // 2. Geocode
      const detected = await reverseGeocode(coords.latitude, coords.longitude);
      
      // 3. Save to database directly
      const { saveAddressJSON } = await import("@/lib/actions/address.actions");
      const input = {
        fullName: "Auto-detected Location",
        phone: "0000000000", // Placeholder for required fields
        line1: detected.line1 || "Detected Address",
        city: detected.city || "Unknown",
        state: detected.state || "Unknown",
        postalCode: detected.postalCode || "000000",
        country: "India",
        label: "Current Location",
        isDefault: false,
      };
      
      const newAddress = await saveAddressJSON(input);
      if (newAddress) {
        setClientAddresses((prev) => [newAddress, ...prev]);
        setAddressId(newAddress.id);
        toast({
          title: "Location Saved & Selected",
          description: `We've detected and selected your location: ${detected.city}, ${detected.state}. You can edit details in your profile later.`,
        });
      }
    } catch (err) {
      toast({
        title: "Location Error",
        description: err instanceof Error ? err.message : "Could not detect and save location.",
        variant: "destructive",
      });
    } finally {
      setGeoLoading(false);
    }
  };

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

  const handleEditClick = () => {
    const selected = clientAddresses.find(a => a.id === addressId);
    if (selected) {
      setEditForm({
        ...selected,
        phone: selected.phone || user?.phone || "",
      });
      setIsEditingAddress(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { saveAddressJSON } = await import("@/lib/actions/address.actions");
      const updated = await saveAddressJSON(editForm);
      if (updated) {
        setClientAddresses(prev => prev.map(a => (a.id === updated.id ? updated : a)));
        setIsEditingAddress(false);
        toast({ title: "Address Updated", description: "Your address has been saved successfully." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not save address.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
          {clientAddresses.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={addressId}
                  onChange={(event) => setAddressId(event.target.value)}
                  className="flex-1 h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 font-body text-sm font-medium shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  disabled={isEditingAddress}
                >
                  {clientAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label}: {address.line1}, {address.city}
                    </option>
                  ))}
                </select>
                {!isEditingAddress && (
                  <Button type="button" variant="outline" className="h-12 rounded-2xl border-outline-variant/20 shrink-0" onClick={handleEditClick}>
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditingAddress && (
                <form onSubmit={handleSaveEdit} className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-bold text-primary mb-2">Edit Delivery Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">Full Name</label>
                      <input required className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.fullName || ""} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">Phone Number</label>
                      <input required className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.phone || ""} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">Address Line 1</label>
                      <input required className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.line1 || ""} onChange={e => setEditForm({...editForm, line1: e.target.value})} />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">Address Line 2 (Optional)</label>
                      <input className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.line2 || ""} onChange={e => setEditForm({...editForm, line2: e.target.value})} />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">City</label>
                      <input required className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.city || ""} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">State</label>
                      <input required className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.state || ""} onChange={e => setEditForm({...editForm, state: e.target.value})} />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-label">Postal Code</label>
                      <input required className="w-full h-10 px-3 text-sm rounded-xl border border-outline-variant/20 outline-none focus:border-primary transition" value={editForm.postalCode || ""} onChange={e => setEditForm({...editForm, postalCode: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/10">
                    <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                    <Button type="submit" size="sm" className="bg-primary text-white rounded-full px-6" disabled={loading}>{loading ? "Saving..." : "Save Address"}</Button>
                  </div>
                </form>
              )}
            </div>
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
              <span className="text-sm font-bold font-headline text-primary whitespace-nowrap">{formatCurrency(item.price * item.quantity, "INR")}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 text-primary">
          <div className="flex justify-between text-lg font-bold">
            <span className="font-headline">Total Amount</span>
            <span className="font-headline text-2xl">{formatCurrency(items.reduce((acc, item) => acc + (item.price * item.quantity), 0), "INR")}</span>
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
