import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserRecord, getUserAddresses } from "@/lib/services/users";
import { ProfileForm } from "@/components/profile/profile-form";
import { AddressManager } from "@/components/profile/address-manager";

export const metadata = {
  title: "My Profile | Shuddham",
  description: "Manage your personal information and addresses.",
};

export default async function ProfilePage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return redirect("/auth/login");

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return redirect("/auth/login");

  // Sync Supabase Auth user to our internal users table
  const userRecord = await ensureUserRecord(authUser);
  if (!userRecord) return redirect("/auth/login");

  const addresses = await getUserAddresses(userRecord.id);

  const memberYear = new Date(userRecord.createdAt).getFullYear();
  const displayName = userRecord.firstName
    ? `${userRecord.firstName}${userRecord.lastName ? ` ${userRecord.lastName}` : ""}`
    : "Your Profile";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
      {/* ─── Personal Header Card ──────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-primary-container to-primary text-white">
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-primary-fixed/20 text-primary-fixed text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-primary-fixed/30">
            Member since {memberYear}
          </span>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-primary-fixed/20 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-low">
              {userRecord.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userRecord.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">person</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold mb-1">{displayName}</h1>
            <p className="text-primary-fixed/80 font-body text-sm tracking-wide">{userRecord.email}</p>
          </div>
        </div>
      </section>

      {/* ─── Smart Wellness Summary ────────────────────────────────── */}
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_20px_40px_rgba(28,28,22,0.06)] border border-outline-variant/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-headline font-bold">Your Balance</h2>
          <span className="material-symbols-outlined text-primary/40">eco</span>
        </div>
        <div className="relative p-6 rounded-xl bg-surface-container-low overflow-hidden group cursor-pointer transition-all hover:bg-surface-container-high">
          <div className="relative z-10">
            <p className="text-on-surface-variant text-sm mb-2">Uncover your constitution</p>
            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
              Discover your dosha
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
        </div>
      </section>

      {/* ─── Stats Cards ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(28,28,22,0.06)] transition-all hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>package</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs uppercase tracking-widest font-label font-bold">Orders</p>
              <p className="text-2xl font-bold text-primary">—</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(28,28,22,0.06)] transition-all hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs uppercase tracking-widest font-label font-bold">Addresses</p>
              <p className="text-2xl font-bold text-primary">{addresses.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Actions ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-on-surface-variant/60 px-2">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a href="/dashboard" className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">local_shipping</span>
            <span className="text-sm font-medium">Track Orders</span>
          </a>
          <a href="/checkout" className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">shopping_cart</span>
            <span className="text-sm font-medium">Checkout</span>
          </a>
          <a href="/products" className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">favorite</span>
            <span className="text-sm font-medium">Browse Shop</span>
          </a>
          <a href="/blogs" className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">help_center</span>
            <span className="text-sm font-medium">Wisdom Journal</span>
          </a>
        </div>
      </section>

      {/* ─── Personal Information ──────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(28,28,22,0.06)] border border-outline-variant/10 space-y-6">
        <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-primary border-l-4 border-primary pl-4">
          Personal Information
        </h3>
        <ProfileForm user={userRecord} />
      </section>

      {/* ─── Address Book ──────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(28,28,22,0.06)] border border-outline-variant/10 space-y-6 pb-12">
        <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-primary border-l-4 border-primary pl-4">
          Address Book
        </h3>
        <AddressManager userId={userRecord.id} initialAddresses={addresses} />
      </section>
    </div>
  );
}
