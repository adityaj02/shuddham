"use client";

import { useState } from "react";
import { getCurrentCoordinates, reverseGeocode, type DetectedAddress } from "@/lib/utils/location";

interface LocationDetectorProps {
  onAddressDetected: (address: DetectedAddress) => void;
  className?: string;
}

export const LocationDetector = ({ 
  onAddressDetected,
  className = "" 
}: LocationDetectorProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetectLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentCoordinates();
      const address = await reverseGeocode(coords.latitude, coords.longitude);
      onAddressDetected(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not detect location.");
      console.error("Location detection error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
      >
        <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
          {loading ? 'sync' : 'my_location'}
        </span>
        {loading ? 'Detecting...' : 'Auto-detect Location'}
      </button>
      
      {error && (
        <p className="text-[10px] text-red-500 font-medium ml-2 animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </p>
      )}
    </div>
  );
};
