"use client";

import { useState } from "react";
import { LocationDetector } from "@/components/shared/location-detector";
import { type DetectedAddress } from "@/lib/utils/location";
import { saveAddressAction } from "@/lib/actions/address.actions";

export const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    label: "Home",
  });

  const handleAddressDetected = (address: DetectedAddress) => {
    setFormData((prev) => ({
      ...prev,
      line1: address.line1 || prev.line1,
      city: address.city || prev.city,
      state: address.state || prev.state,
      postalCode: address.postalCode || prev.postalCode,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">Add address</h2>
        <LocationDetector onAddressDetected={handleAddressDetected} />
      </div>

      <form action={saveAddressAction} className="grid gap-3">
        <input
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
          required
        />
        <input
          name="line1"
          placeholder="Address line 1"
          value={formData.line1}
          onChange={handleChange}
          className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
          required
        />
        <input
          name="line2"
          placeholder="Address line 2"
          value={formData.line2}
          onChange={handleChange}
          className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
            required
          />
          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="postalCode"
            placeholder="Postal code"
            value={formData.postalCode}
            onChange={handleChange}
            className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
            required
          />
          <input
            name="label"
            placeholder="Label"
            value={formData.label}
            onChange={handleChange}
            className="h-11 rounded-2xl border border-border bg-white px-4 focus:border-primary outline-none transition-all"
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground select-none cursor-pointer">
          <input type="checkbox" name="isDefault" className="accent-primary" />
          Set as default address
        </label>
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]">
          Save address
        </button>
      </form>
    </div>
  );
};
