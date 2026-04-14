"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Shop", icon: "spa", href: "/products" },
  { label: "Wisdom", icon: "auto_stories", href: "/blogs" },
  { label: "Profile", icon: "person", href: "/dashboard" },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center px-4 py-2 mx-auto max-w-md w-[90%] bg-white/70 dark:bg-primary/70 backdrop-blur-[20px] rounded-3xl shadow-[0px_20px_40px_rgba(28,28,22,0.06)] md:hidden">
      {tabs.map((tab) => {
        const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-full p-3 scale-110 -translate-y-2 shadow-lg transition-all duration-500"
                : "flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-primary transition-all duration-300"
            }
          >
            <span
              className="material-symbols-outlined mb-0.5"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className={`font-body uppercase tracking-[0.05em] ${isActive ? "text-[8px] mt-0.5" : "text-[10px]"}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
