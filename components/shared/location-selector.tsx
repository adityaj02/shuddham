"use client";

import { MapPin, RefreshCcw } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { cn } from "@/lib/utils";

export const LocationSelector = ({ className }: { className?: string }) => {
  const { city, state, loading, error, detectLocation } = useGeolocation();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <MapPin className="h-3 w-3" />
        Deliver to
      </div>
      <button
        onClick={detectLocation}
        disabled={loading}
        className="group relative flex items-center gap-2 rounded-xl border border-border bg-white/50 px-3 py-1.5 transition hover:border-primary hover:bg-white"
      >
        <span className={cn(
          "max-w-[120px] truncate font-display text-sm",
          loading && "animate-pulse opacity-50"
        )}>
          {loading ? "Detecting..." : (city ? `${city}${state ? `, ${state}` : ""}` : "Select Location")}
        </span>
        
        <RefreshCcw className={cn(
          "h-3 w-3 text-muted-foreground transition group-hover:rotate-180 group-hover:text-primary",
          loading && "animate-spin text-primary"
        )} />

        {error && (
          <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-red-50 p-2 text-[10px] text-red-600 shadow-lg ring-1 ring-red-200">
            {error}
          </div>
        )}
      </button>
    </div>
  );
};
