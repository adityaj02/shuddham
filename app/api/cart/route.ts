import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getCartSnapshot, syncCartSnapshot } from "@/lib/services/users";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ data: [] });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: [] });

  const items = await getCartSnapshot(user.id);
  return NextResponse.json({ data: items });
}

export async function PUT(request: Request) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    const json = await request.json();
    return NextResponse.json({ data: Array.isArray(json.items) ? json.items : [] });
  }

  const { data: { user } } = await supabase.auth.getUser();
  const json = await request.json();
  const items = Array.isArray(json.items) ? json.items : [];

  if (!user) {
    return NextResponse.json({ data: items });
  }

  const synced = await syncCartSnapshot(user.id, items);
  return NextResponse.json({ data: synced });
}
