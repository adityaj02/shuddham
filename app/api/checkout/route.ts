import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import { initializeCheckout, verifyCheckout } from "@/lib/services/checkout";
import { ensureUserRecord, getUserByAuthId } from "@/lib/services/users";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Auth not configured. Add Supabase env keys." },
        { status: 503 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUser =
      (await getUserByAuthId(user.id)) ?? (await ensureUserRecord(user));
    if (!appUser) {
      return NextResponse.json({ error: "User not synced" }, { status: 404 });
    }

    const json = await request.json();

    if (json.intent === "verify") {
      const verification = await verifyCheckout({
        orderId: json.orderId,
        gateway: json.gateway,
        paymentId: json.paymentId,
      });

      return NextResponse.json({ data: verification });
    }

    const payload = checkoutSchema.parse(json);
    const result = await initializeCheckout({
      userId: appUser.id,
      payload,
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize checkout." },
      { status: 400 }
    );
  }
}

