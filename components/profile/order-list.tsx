"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { cancelOrderAction } from "@/lib/actions/orders";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant",
  paid: "bg-secondary-container text-on-secondary-fixed-variant",
  processing: "bg-primary-fixed/30 text-primary",
  shipped: "bg-primary-fixed text-on-primary-fixed",
  delivered: "bg-secondary-container text-on-secondary-container",
  cancelled: "bg-error-container text-on-error-container",
};

export const OrderList = ({ orders }: { orders: Order[] }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    setLoadingOrderId(orderId);
    try {
      await cancelOrderAction(orderId);
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel order.",
        variant: "destructive",
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/10">
        <span className="material-symbols-outlined text-4xl text-outline-variant mb-3 block">receipt_long</span>
        <p className="text-on-surface-variant text-sm">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const colorClass = statusColors[order.status] ?? "bg-surface-container-high text-on-surface";
        const isCancellable = ["pending", "paid"].includes(order.status);

        return (
          <div
            key={order.id}
            className="bg-surface-container-lowest overflow-hidden rounded-2xl border border-outline-variant/10 shadow-[0px_8px_24px_rgba(28,28,22,0.04)] hover:shadow-[0px_12px_32px_rgba(28,28,22,0.08)] transition-all duration-300 group"
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] font-label">Order Reference</p>
                  <p className="font-headline font-bold text-xl text-primary">{order.orderNumber}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-block text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${colorClass}`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-secondary/40">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] font-label">Total Amount</p>
                  <p className="text-2xl font-bold font-headline text-primary">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] font-label border-b border-outline-variant/10 pb-2">Order Summary</p>
                <div className="grid gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-4 group/item">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-container-low rounded-lg p-1 flex items-center justify-center">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-contain grayscale-[0.5] group-hover/item:grayscale-0 transition-all" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary lowercase first-letter:uppercase">{item.productName}</p>
                          <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-primary">{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {isCancellable && (
                <div className="mt-8 pt-6 border-t border-outline-variant/10 flex justify-end">
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={loadingOrderId === order.id}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-error/20 text-error text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-error hover:text-white transition-all disabled:opacity-50 active:scale-95"
                  >
                    {loadingOrderId === order.id ? (
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">cancel</span>
                    )}
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
