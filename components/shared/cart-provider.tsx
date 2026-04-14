"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeJsonParse } from "@/lib/utils";
import type { CartItem } from "@/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "shuddham-cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const hasHydratedRef = useRef(false);
  const supabase = createSupabaseBrowserClient();

  // Handle Hydration from LocalStorage
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setItems(safeJsonParse<CartItem[]>(stored, []));
    hasHydratedRef.current = true;
  }, []);

  // Handle Auth changes
  useEffect(() => {
    if (!supabase) return;

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Sync to LocalStorage and optionally to Database
  useEffect(() => {
    if (!hasHydratedRef.current) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    if (!userId) return;

    const controller = new AbortController();
    void fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
      signal: controller.signal,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [items, userId]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (item) =>
        setItems((current) => {
          const existing = current.find((entry) => entry.productId === item.productId);
          if (!existing) return [...current, item];
          return current.map((entry) =>
            entry.productId === item.productId
              ? {
                  ...entry,
                  quantity: Math.min(entry.quantity + item.quantity, entry.stock),
                }
              : entry
          );
        }),
      updateQuantity: (productId, quantity) =>
        setItems((current) =>
          current
            .map((entry) =>
              entry.productId === productId
                ? { ...entry, quantity: Math.max(1, Math.min(quantity, entry.stock)) }
                : entry
            )
            .filter((entry) => entry.quantity > 0)
        ),
      removeItem: (productId) =>
        setItems((current) =>
          current.filter((entry) => entry.productId !== productId)
        ),
      clearCart: () => setItems([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
};
