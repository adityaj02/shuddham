import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import { createOrder, getOrdersByUser } from "@/lib/services/orders";
import { ensureUserRecord, getUserByAuthId } from "@/lib/services/users";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ data: [], meta: { preview: true } });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: [] });

  const appUser = await getUserByAuthId(user.id);
  const orders = await getOrdersByUser(appUser?.id);

  return NextResponse.json({ data: orders });
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Auth not configured." },
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
    const order = await createOrder({
      userId: appUser.id,
      addressId: json.addressId,
      items: json.items ?? [],
      gateway: json.gateway ?? "razorpay",
      note: json.note,
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order." },
      { status: 400 }
    );
  }
}

