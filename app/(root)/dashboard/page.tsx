import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { AddressForm } from "@/components/shared/address-form";
import { getOrdersByUser } from "@/lib/services/orders";
import { ensureUserRecord, getUserAddresses } from "@/lib/services/users";
import { formatCurrency } from "@/lib/utils";
import { OrderList } from "@/components/profile/order-list";

const DashboardPage = async () => {
  const session = await getSession();

  if (!session.userId) {
    redirect("/auth/login");
  }

  const appUser = await ensureUserRecord(session.user);

  if (!appUser) {
    redirect("/");
  }

  const [orders, addresses] = await Promise.all([
    getOrdersByUser(appUser.id),
    getUserAddresses(appUser.id),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8 pb-20">
      {/* ─── Header ────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <span className="text-tertiary-fixed-dim text-[10px] tracking-[0.3em] font-bold uppercase opacity-50">Customer Dashboard</span>
        <h1 className="font-headline text-4xl text-primary font-bold">Portal</h1>
      </div>

      {/* ─── Stats Cards ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-[0px_12px_32px_rgba(28,28,22,0.04)] transition-all hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label font-bold opacity-60">Orders</p>
              <p className="text-2xl font-bold font-headline text-primary">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-[0px_12px_32px_rgba(28,28,22,0.04)] transition-all hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label font-bold opacity-60">Addresses</p>
              <p className="text-2xl font-bold font-headline text-primary">{addresses.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Order History ─────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-primary/10 pb-4">
          <div className="space-y-1">
            <h2 className="font-headline text-2xl font-bold text-primary">Order History</h2>
            <p className="text-secondary/60 text-xs">Track and manage your wellness journey</p>
          </div>
          <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
            Total {orders.length}
          </span>
        </div>

        <OrderList orders={orders} />
      </section>

      {/* ─── Saved Addresses ───────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-primary/10 pb-4">
          <div className="space-y-1">
            <h2 className="font-headline text-2xl font-bold text-primary">Saved Addresses</h2>
            <p className="text-secondary/60 text-xs">Manage your shipping destinations</p>
          </div>
          <Link href="/profile" className="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors">
            Manage
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/10">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-3 block">location_off</span>
            <p className="text-on-surface-variant text-sm">No saved addresses.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-surface-container-lowest p-6 rounded-2xl relative transition-all duration-300 ${
                  addr.isDefault
                    ? "border-2 border-primary/20 bg-primary/[0.02] shadow-[0px_12px_32px_rgba(28,28,22,0.06)]"
                    : "border border-outline-variant/10 hover:border-outline shadow-sm"
                }`}
              >
                {addr.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                      Default
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-primary flex items-center gap-2">
                    {addr.fullName}
                    <span className="text-[10px] text-on-surface-variant font-bold opacity-30 uppercase tracking-widest">| {addr.label ?? "Home"}</span>
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                    <br />
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="text-xs font-bold text-primary/60 mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">call</span>
                    {addr.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Add Address Form ──────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_16px_48px_rgba(28,28,22,0.06)] border border-outline-variant/10 pb-12">
        <div className="mb-8">
           <h2 className="font-headline text-2xl font-bold text-primary">New Location</h2>
           <p className="text-secondary/60 text-xs">Add a delivery address for your wellness boxes</p>
        </div>
        <AddressForm />
      </section>
    </div>
  );
};

export default DashboardPage;
