import { NextResponse } from "next/server";

import { isAdminSession } from "@/lib/auth";
import { getProducts, upsertProduct } from "@/lib/services/products";
import { productSchema } from "@/lib/validations/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = await getProducts({
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("query") ?? undefined,
    featured: searchParams.get("featured") === "true",
  });

  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  try {
    const allowed = await isAdminSession();
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const payload = productSchema.parse(json);
    const product = await upsertProduct(payload);

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save product." },
      { status: 400 }
    );
  }
}
