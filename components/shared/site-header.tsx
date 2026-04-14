"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

import { navigationLinks, siteConfig } from "@/constants";
import { useCart } from "@/components/shared/cart-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const SiteHeader = () => {
  const { count } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createSupabaseBrowserClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-surface-container-low h-full shadow-2xl flex flex-col pt-6 font-body animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-6 pb-6 border-b border-primary/10">
              <h2 className="font-headline font-bold text-primary tracking-[0.2em] uppercase">
                {siteConfig.shortName}
              </h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col flex-1 px-6 py-6 gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-primary/50 tracking-widest uppercase">Menu</p>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-secondary font-semibold hover:text-primary transition-colors flex items-center gap-3"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="w-full h-px bg-primary/10 my-2"></div>

              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-primary/50 tracking-widest uppercase">Connect</p>
                <a href="https://mail.google.com/mail/u/0/?fs=1&to=shivskukreja@gmail.com&su=Inquiry&body=Hi+Shuddham,%0A%0A&tf=cm" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-secondary hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </div>
                  <span className="font-semibold text-sm">Support Mail</span>
                </a>
                <a href="https://api.whatsapp.com/send/?phone=919811797407&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-secondary hover:text-[#25D366] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/5 group-hover:bg-[#25D366]/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm">chat</span>
                  </div>
                  <span className="font-semibold text-sm">WhatsApp</span>
                </a>
              </div>
            </nav>

            <div className="p-6 border-t border-primary/10 bg-primary/5">
              {user ? (
                <button onClick={handleLogout} className="w-full py-3 bg-white border border-primary/10 text-primary text-xs uppercase tracking-widest font-bold rounded-xl shadow-sm">
                  Logout
                </button>
              ) : (
                <Link href="/auth/login" onClick={() => setIsSidebarOpen(false)} className="flex justify-center w-full py-3 bg-primary text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-[0px_4px_12px_rgba(28,28,22,0.1)]">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 py-4 tonal-transition border-b border-primary/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity duration-300 md:hidden"
          >
            menu
          </button>
          <Link href="/">
            <h1 className="font-headline font-bold text-primary tracking-[0.2em] text-2xl uppercase">
              {siteConfig.shortName}
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 items-center">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary hover:opacity-70 font-body text-xs uppercase tracking-widest transition-opacity duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/cart" className="relative group p-2">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">
              shopping_cart
            </span>
            {count > 0 ? (
              <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white shadow-sm scale-in">
                {count}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="group relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 hover:border-primary transition-all duration-300"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                  </div>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-widest text-secondary hover:text-primary transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex bg-primary text-white px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-primary/90 hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
};
