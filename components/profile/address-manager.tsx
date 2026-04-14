"use client";

import { useState } from "react";
import { Address } from "@/types";
import { upsertAddress } from "@/lib/services/users";
import { toast } from "@/components/ui/use-toast";
import { LocationDetector } from "@/components/shared/location-detector";
import { type DetectedAddress } from "@/lib/utils/location";

interface AddressManagerProps {
  userId: string;
  initialAddresses: Address[];
}

export const AddressManager = ({ userId, initialAddresses }: AddressManagerProps) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
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

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const input = {
      fullName: formData.fullName,
      phone: formData.phone,
      line1: formData.line1,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: "India",
      label: formData.label,
      isDefault: addresses.length === 0,
    };

    try {
      const newAddress = await upsertAddress(userId, input);
      if (newAddress) {
        setAddresses([newAddress, ...addresses]);
        setIsAdding(false);
        setFormData({
          fullName: "",
          phone: "",
          line1: "",
          city: "",
          state: "",
          postalCode: "",
          label: "Home",
        });
        toast({ title: "Address added" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add address" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase font-bold tracking-[0.2em] text-secondary">
          Saved Addresses
        </label>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-[10px] uppercase font-bold text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Add New
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleAddAddress} className="space-y-4 bg-surface-container-low p-6 rounded-3xl border border-primary/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary/60">New Residence</span>
            <LocationDetector onAddressDetected={handleAddressDetected} />
          </div>
          
          <input 
            name="fullName" 
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={handleChange}
            required 
            className="w-full bg-white rounded-xl px-4 py-3 outline-none text-sm placeholder:text-on-surface-variant/30 border border-transparent focus:border-primary/20 transition-all" 
          />
          <input 
            name="phone" 
            placeholder="Contact Number" 
            value={formData.phone}
            onChange={handleChange}
            required 
            className="w-full bg-white rounded-xl px-4 py-3 outline-none text-sm placeholder:text-on-surface-variant/30 border border-transparent focus:border-primary/20 transition-all" 
          />
          <input 
            name="line1" 
            placeholder="Address Line 1" 
            value={formData.line1}
            onChange={handleChange}
            required 
            className="w-full bg-white rounded-xl px-4 py-3 outline-none text-sm placeholder:text-on-surface-variant/30 border border-transparent focus:border-primary/20 transition-all" 
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              name="city" 
              placeholder="City" 
              value={formData.city}
              onChange={handleChange}
              required 
              className="w-full bg-white rounded-xl px-4 py-3 outline-none text-sm placeholder:text-on-surface-variant/30 border border-transparent focus:border-primary/20 transition-all" 
            />
            <input 
              name="state" 
              placeholder="State" 
              value={formData.state}
              onChange={handleChange}
              required 
              className="w-full bg-white rounded-xl px-4 py-3 outline-none text-sm placeholder:text-on-surface-variant/30 border border-transparent focus:border-primary/20 transition-all" 
            />
          </div>
          <input 
            name="postalCode" 
            placeholder="Postal Code" 
            value={formData.postalCode}
            onChange={handleChange}
            required 
            className="w-full bg-white rounded-xl px-4 py-3 outline-none text-sm placeholder:text-on-surface-variant/30 border border-transparent focus:border-primary/20 transition-all" 
          />
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.1em] border border-outline-variant/30 text-secondary hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-12 text-center border-2 border-dashed border-primary/10">
          <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">location_off</span>
          <p className="text-sm text-secondary font-body">No addresses found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="relative group bg-white p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all hover:shadow-[0px_20px_40px_rgba(28,28,22,0.04)] shadow-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                    {addr.fullName}
                    {addr.isDefault && (
                      <span className="bg-primary/10 text-primary text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tighter font-bold">Default</span>
                    )}
                  </h4>
                  <p className="text-on-surface-variant text-xs mt-1 font-body">{addr.line1}</p>
                  <p className="text-on-surface-variant text-xs font-body opacity-60">{addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p className="text-primary text-xs font-body mt-2 flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-xs">call</span>
                    {addr.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
