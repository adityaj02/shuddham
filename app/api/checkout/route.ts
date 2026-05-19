import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
    
    // Validate address exists and belongs to user (use admin client to bypass RLS)
    const adminClient = createSupabaseAdminClient();
    const { data: addressExists, error: addressError } = adminClient
      ? await adminClient
          .from("addresses")
          .select("id")
          .eq("id", payload.addressId)
          .eq("user_id", appUser.id)
          .maybeSingle()
      : { data: null, error: null };
      
    if (addressError) {
      console.error("[Checkout] Address validation DB error:", addressError);
    }
      
    if (!addressExists) {
      return NextResponse.json({ error: "Invalid delivery address selected." }, { status: 400 });
    }

    const result = await initializeCheckout({
      userId: appUser.id,
      payload,
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("[Checkout] Caught error:", error);
    
    // Check if it's a Zod validation error
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as any;
      const firstIssue = zodError.issues?.[0];
      const message = firstIssue 
        ? `Validation error: ${firstIssue.path.join('.')} - ${firstIssue.message}` 
        : "Invalid request payload.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize checkout." },
      { status: 400 }
    );
  }
}

