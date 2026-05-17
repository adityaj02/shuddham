"use client";

import { useState, useCallback, useEffect } from "react";

import { getCurrentCoordinates, reverseGeocode } from "@/lib/utils/location";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  city: string | null;
  state: string | null;
  formattedAddress: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    city: null,
    state: null,
    formattedAddress: null,
  });

  const detectLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const coords = await getCurrentCoordinates();
      const address = await reverseGeocode(coords.latitude, coords.longitude);

      const newState = {
        loading: false,
        error: null,
        city: address.city,
        state: address.state,
        formattedAddress: address.line1 + (address.city ? `, ${address.city}` : ""),
      };

      setState(newState);
      localStorage.setItem("vdh_user_location", JSON.stringify(newState));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to detect location.",
      }));
    }
  }, []);

  // Hydrate from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("vdh_user_location");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        localStorage.removeItem("vdh_user_location");
      }
    }
  }, []);

  return { ...state, detectLocation };
};
