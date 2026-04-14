import { CartPageClient } from "@/components/shared/cart-page-client";

const CartPage = () => {
  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="badge-soft">Cart</p>
        <h1 className="section-title mt-3">Review your order</h1>
      </div>
      <CartPageClient />
    </div>
  );
};

export default CartPage;
