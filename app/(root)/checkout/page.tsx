import { CheckoutClient } from "@/components/shared/checkout-client";
import { redirect } from "next/navigation";

import { getSession, requireUser } from "@/lib/auth";
import { demoAddresses } from "@/lib/data/demo";
import { hasClerkEnv } from "@/lib/env";
import { ensureUserRecord, getUserAddresses } from "@/lib/services/users";

const CheckoutPage = async () => {
  const session = await requireUser();
  const appUser = await ensureUserRecord(session.user);
  
  const addresses = appUser ? await getUserAddresses(appUser.id) : [];

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="badge-soft">Checkout</p>
        <h1 className="section-title mt-3">Secure Payment</h1>
      </div>
      <CheckoutClient addresses={addresses} />
    </div>
  );
};

export default CheckoutPage;
