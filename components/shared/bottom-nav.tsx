"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Shop", icon: "spa", href: "/products" },
  { label: "Wisdom", icon: "auto_stories", href: "/blogs" },
  { label: "Profile", icon: "person", href: "/profile" },
];

import GooeyNav from "@/components/ui/gooey-nav";

export const BottomNav = () => {
  const pathname = usePathname();
  
  const activeIndex = tabs.findIndex(tab => 
    tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
  );

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center md:hidden">
      <div className="bg-white/70 dark:bg-primary/70 backdrop-blur-[20px] rounded-3xl shadow-[0px_20px_40px_rgba(28,28,22,0.06)] p-1">
        <GooeyNav 
          items={tabs} 
          initialActiveIndex={activeIndex === -1 ? 0 : activeIndex}
          particleCount={10}
        />
      </div>
    </nav>
  );
};
