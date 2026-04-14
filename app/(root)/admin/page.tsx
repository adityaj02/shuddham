import { redirect } from "next/navigation";

import {
  deleteProductAction,
  saveProductAction,
  updateOrderStatusAction,
} from "@/lib/actions/admin.actions";
import { adminOrderStatuses } from "@/constants";
import { isAdminSession } from "@/lib/auth";
import { hasClerkEnv } from "@/lib/env";
import { getAllOrders } from "@/lib/services/orders";
import { getCategories, getProducts } from "@/lib/services/products";
import { formatCurrency } from "@/lib/utils";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { edit?: string };
}) => {
  if (!hasClerkEnv) {
    const [products, categories, orders] = await Promise.all([
      getProducts(),
      getCategories(),
      getAllOrders(),
    ]);
    const editingProduct = products.find((product) => product.slug === searchParams.edit);

    return (
      <div className="page-shell space-y-10">
        <div>
          <p className="badge-soft">Admin Preview</p>
          <h1 className="section-title mt-3">Catalog, inventory, and fulfillment controls</h1>
          <p className="mt-3 section-copy">
            Clerk is not configured, so admin controls are visible in preview mode without requiring sign-in.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-card p-6">
            <h2 className="font-display text-3xl">Add product</h2>
            <form action={saveProductAction} className="mt-5 grid gap-3">
              <input type="hidden" name="id" value={editingProduct?.id ?? ""} />
              <select
                name="categoryId"
                defaultValue={editingProduct?.categoryId}
                className="h-11 rounded-2xl border border-border bg-white px-4"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input name="name" placeholder="Product name" defaultValue={editingProduct?.name} className="h-11 rounded-2xl border border-border bg-white px-4" />
              <input name="subtitle" placeholder="Subtitle" defaultValue={editingProduct?.subtitle} className="h-11 rounded-2xl border border-border bg-white px-4" />
              <input name="shortDescription" placeholder="Short description" defaultValue={editingProduct?.shortDescription} className="h-11 rounded-2xl border border-border bg-white px-4" />
              <textarea name="description" placeholder="Description" defaultValue={editingProduct?.description} className="min-h-[120px] rounded-2xl border border-border bg-white px-4 py-3" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="sku" placeholder="SKU" defaultValue={editingProduct?.sku} className="h-11 rounded-2xl border border-border bg-white px-4" />
                <input name="image" placeholder="/assets/products/ghee-jar.svg" defaultValue={editingProduct?.images[0]} className="h-11 rounded-2xl border border-border bg-white px-4" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input name="price" type="number" placeholder="Price" defaultValue={editingProduct?.price} className="h-11 rounded-2xl border border-border bg-white px-4" />
                <input name="compareAtPrice" type="number" placeholder="Compare at" defaultValue={editingProduct?.compareAtPrice ?? undefined} className="h-11 rounded-2xl border border-border bg-white px-4" />
                <input name="stock" type="number" placeholder="Stock" defaultValue={editingProduct?.stock} className="h-11 rounded-2xl border border-border bg-white px-4" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" defaultChecked={editingProduct?.isFeatured} />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" defaultChecked={editingProduct ? editingProduct.isActive : true} />
                  Active
                </label>
              </div>
              <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                {editingProduct ? "Update product" : "Save product"}
              </button>
            </form>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-3xl">Inventory overview</h2>
            <div className="mt-5 space-y-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-[22px] border border-border bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku} - {product.stock} units</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                      <a href={`/admin?edit=${product.slug}`} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                        Edit
                      </a>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="font-display text-3xl">Fulfillment queue</h2>
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[22px] border border-border bg-white p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")}
                    </p>
                  </div>

                  <form action={updateOrderStatusAction} className="flex flex-wrap items-center gap-3">
                    <input type="hidden" name="orderId" value={order.id} />
                    <select name="status" defaultValue={order.status} className="h-11 rounded-full border border-border bg-white px-4">
                      {adminOrderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                      Update
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const allowed = await isAdminSession();

  if (!allowed) {
    redirect("/dashboard");
  }

  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getCategories(),
    getAllOrders(),
  ]);
  const editingProduct = products.find((product) => product.slug === searchParams.edit);

  return (
    <div className="page-shell space-y-10">
      <div>
        <p className="badge-soft">Admin Dashboard</p>
        <h1 className="section-title mt-3">Catalog, inventory, and fulfillment controls</h1>
      </div>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card p-6">
          <h2 className="font-display text-3xl">Add product</h2>
          <form action={saveProductAction} className="mt-5 grid gap-3">
            <input type="hidden" name="id" value={editingProduct?.id ?? ""} />
            <select
              name="categoryId"
              defaultValue={editingProduct?.categoryId}
              className="h-11 rounded-2xl border border-border bg-white px-4"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              name="name"
              placeholder="Product name"
              defaultValue={editingProduct?.name}
              className="h-11 rounded-2xl border border-border bg-white px-4"
            />
            <input
              name="subtitle"
              placeholder="Subtitle"
              defaultValue={editingProduct?.subtitle}
              className="h-11 rounded-2xl border border-border bg-white px-4"
            />
            <input
              name="shortDescription"
              placeholder="Short description"
              defaultValue={editingProduct?.shortDescription}
              className="h-11 rounded-2xl border border-border bg-white px-4"
            />
            <textarea
              name="description"
              placeholder="Description"
              defaultValue={editingProduct?.description}
              className="min-h-[120px] rounded-2xl border border-border bg-white px-4 py-3"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="sku"
                placeholder="SKU"
                defaultValue={editingProduct?.sku}
                className="h-11 rounded-2xl border border-border bg-white px-4"
              />
              <input
                name="image"
                placeholder="/assets/products/ghee-jar.svg"
                defaultValue={editingProduct?.images[0]}
                className="h-11 rounded-2xl border border-border bg-white px-4"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                name="price"
                type="number"
                placeholder="Price"
                defaultValue={editingProduct?.price}
                className="h-11 rounded-2xl border border-border bg-white px-4"
              />
              <input
                name="compareAtPrice"
                type="number"
                placeholder="Compare at"
                defaultValue={editingProduct?.compareAtPrice ?? undefined}
                className="h-11 rounded-2xl border border-border bg-white px-4"
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                defaultValue={editingProduct?.stock}
                className="h-11 rounded-2xl border border-border bg-white px-4"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" defaultChecked={editingProduct?.isFeatured} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingProduct ? editingProduct.isActive : true}
                />
                Active
              </label>
            </div>
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              {editingProduct ? "Update product" : "Save product"}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display text-3xl">Inventory overview</h2>
          <div className="mt-5 space-y-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-[22px] border border-border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sku} - {product.stock} units</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                    <a
                      href={`/admin?edit=${product.slug}`}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                    >
                      Edit
                    </a>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="font-display text-3xl">Fulfillment queue</h2>
        <div className="mt-5 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[22px] border border-border bg-white p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")}
                  </p>
                </div>

                <form action={updateOrderStatusAction} className="flex flex-wrap items-center gap-3">
                  <input type="hidden" name="orderId" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="h-11 rounded-full border border-border bg-white px-4"
                  >
                    {adminOrderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    Update
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
