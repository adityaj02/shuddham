import { Resend } from "resend";
import { env, hasResendEnv, ADMIN_ORDER_EMAIL } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";
import type { Order, Address, AppUser } from "@/types";

const adminResend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const customerResend = env.RESEND_CUSTOMER_API_KEY ? new Resend(env.RESEND_CUSTOMER_API_KEY) : adminResend;

const SENDER = "SHUDDHAM Orders <onboarding@resend.dev>";

// ─── Shared Styles ──────────────────────────────────────────────────────────

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #f8f6f3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c28 100%); padding: 32px 40px; text-align: center; }
  .header h1 { color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 4px; font-weight: 300; }
  .header p { color: #c8e6a0; font-size: 12px; margin: 8px 0 0 0; letter-spacing: 2px; text-transform: uppercase; }
  .body-content { padding: 32px 40px; }
  .section-title { font-size: 16px; font-weight: 700; color: #2d5016; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #e8e4df; padding-bottom: 8px; margin: 28px 0 16px 0; }
  .info-grid { display: table; width: 100%; border-collapse: collapse; }
  .info-row { display: table-row; }
  .info-label { display: table-cell; padding: 6px 12px 6px 0; font-size: 13px; color: #8a8577; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 140px; vertical-align: top; }
  .info-value { display: table-cell; padding: 6px 0; font-size: 14px; color: #333; vertical-align: top; }
  table.items { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.items th { text-align: left; font-size: 11px; color: #8a8577; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; border-bottom: 2px solid #e8e4df; }
  table.items td { padding: 12px; font-size: 14px; color: #333; border-bottom: 1px solid #f0ece7; }
  table.items td.num { text-align: right; font-variant-numeric: tabular-nums; }
  .totals { margin: 16px 0; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
  .totals-row.grand { border-top: 2px solid #2d5016; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 700; color: #2d5016; }
  .footer { background: #f8f6f3; padding: 24px 40px; text-align: center; }
  .footer p { font-size: 12px; color: #8a8577; margin: 4px 0; }
  .badge { display: inline-block; background: #e8f5d9; color: #2d5016; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
  .highlight-box { background: #f8f6f3; border-radius: 12px; padding: 20px; margin: 16px 0; border-left: 4px solid #4a7c28; }
`;

// ─── Build Product Items Table ──────────────────────────────────────────────

const buildItemsTable = (items: Order["items"], currency: Order["currency"]) => `
  <table class="items">
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (item) => `
        <tr>
          <td><strong>${item.productName}</strong></td>
          <td style="text-align:center">${item.quantity}</td>
          <td class="num">${formatCurrency(item.unitPrice, currency)}</td>
          <td class="num"><strong>${formatCurrency(item.totalPrice, currency)}</strong></td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;

// ─── Build Totals Section ───────────────────────────────────────────────────

const buildTotals = (order: Order) => `
  <div class="totals">
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#555;">Subtotal</td>
        <td style="padding:6px 0; font-size:14px; color:#555; text-align:right;">${formatCurrency(order.subtotal, order.currency)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#555;">Shipping</td>
        <td style="padding:6px 0; font-size:14px; color:#555; text-align:right;">${order.shippingAmount === 0 ? '<span style="color:#4a7c28; font-weight:600;">FREE</span>' : formatCurrency(order.shippingAmount, order.currency)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#555;">Tax (GST 5%)</td>
        <td style="padding:6px 0; font-size:14px; color:#555; text-align:right;">${formatCurrency(order.taxAmount, order.currency)}</td>
      </tr>
      ${order.discountAmount > 0 ? `
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#4a7c28;">Discount</td>
        <td style="padding:6px 0; font-size:14px; color:#4a7c28; text-align:right;">-${formatCurrency(order.discountAmount, order.currency)}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:12px 0 6px 0; font-size:20px; font-weight:700; color:#2d5016; border-top:2px solid #2d5016;">Total</td>
        <td style="padding:12px 0 6px 0; font-size:20px; font-weight:700; color:#2d5016; border-top:2px solid #2d5016; text-align:right;">${formatCurrency(order.totalAmount, order.currency)}</td>
      </tr>
    </table>
  </div>
`;

// ─── Build Address Block ────────────────────────────────────────────────────

const buildAddressBlock = (address: Address) => `
  <div class="highlight-box">
    <strong style="color:#2d5016;">${address.fullName}</strong><br/>
    ${address.line1}${address.line2 ? `, ${address.line2}` : ""}<br/>
    ${address.city}, ${address.state} – ${address.postalCode}<br/>
    ${address.country}<br/>
    <span style="color:#8a8577;">📞 ${address.phone}</span>
  </div>
`;

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN NOTIFICATION EMAIL
// ═══════════════════════════════════════════════════════════════════════════

export const sendOrderAdminNotification = async ({
  order,
  address,
  customer,
}: {
  order: Order;
  address: Address | null;
  customer: AppUser | null;
}) => {
  if (!adminResend) {
    console.log("[Email] Admin Resend not configured – skipping admin notification.");
    return;
  }

  const customerName = customer
    ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "Unknown"
    : "Unknown";

  const html = `
  <!DOCTYPE html>
  <html>
  <head><style>${baseStyles}</style></head>
  <body>
    <div style="padding: 24px; background: #f8f6f3;">
      <div class="wrapper">
        <div class="header">
          <h1>SHUDDHAM</h1>
          <p>New Order Received</p>
        </div>

        <div class="body-content">
          <p style="font-size:16px; color:#333;">A new order has been placed and requires your attention.</p>

          <div style="text-align:center; margin:20px 0;">
            <span class="badge">Order ${order.orderNumber}</span>
            <span class="badge" style="margin-left:8px;">${order.paymentGateway.toUpperCase()}</span>
            <span class="badge" style="margin-left:8px;">${order.status.toUpperCase()}</span>
          </div>

          <!-- Customer Info -->
          <div class="section-title">👤 Customer Details</div>
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 12px 6px 0; font-size:13px; color:#8a8577; font-weight:600; width:120px;">Name</td>
              <td style="padding:6px 0; font-size:14px; color:#333;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0; font-size:13px; color:#8a8577; font-weight:600;">Email</td>
              <td style="padding:6px 0; font-size:14px; color:#333;">${customer?.email ?? "N/A"}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0; font-size:13px; color:#8a8577; font-weight:600;">Phone</td>
              <td style="padding:6px 0; font-size:14px; color:#333;">${customer?.phone ?? "N/A"}</td>
            </tr>
          </table>

          <!-- Delivery Address -->
          <div class="section-title">📦 Delivery Address</div>
          ${address ? buildAddressBlock(address) : '<p style="color:#8a8577;">No address on file.</p>'}

          <!-- Order Items -->
          <div class="section-title">🛒 Order Items</div>
          ${buildItemsTable(order.items, order.currency)}

          <!-- Cost Breakdown -->
          <div class="section-title">💰 Cost Breakdown</div>
          ${buildTotals(order)}

          <!-- Order Meta -->
          ${order.notes ? `
          <div class="section-title">📝 Customer Note</div>
          <div class="highlight-box">${order.notes}</div>
          ` : ""}

          <p style="font-size:12px; color:#8a8577; margin-top:24px; text-align:center;">
            Placed on ${new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" })}
          </p>
        </div>

        <div class="footer">
          <p><strong>SHUDDHAM Wellness</strong></p>
          <p>This is an automated admin notification.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const { error } = await adminResend.emails.send({
      from: SENDER,
      to: [ADMIN_ORDER_EMAIL],
      subject: `🛒 New Order ${order.orderNumber} – ${formatCurrency(order.totalAmount, order.currency)} from ${customerName}`,
      html,
    });

    if (error) {
      console.error("[Email] Admin notification failed:", error);
    } else {
      console.log(`[Email] Admin notification sent for ${order.orderNumber}`);
    }
  } catch (err) {
    console.error("[Email] Admin notification error:", err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER CONFIRMATION EMAIL
// ═══════════════════════════════════════════════════════════════════════════

export const sendOrderCustomerConfirmation = async ({
  order,
  address,
  customer,
}: {
  order: Order;
  address: Address | null;
  customer: AppUser | null;
}) => {
  if (!customerResend || !customer?.email) {
    console.log("[Email] Customer Resend not configured or no customer email – skipping confirmation.");
    return;
  }

  const firstName = customer?.firstName ?? "Valued Customer";
  const customerName = `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim() || firstName;

  const html = `
  <!DOCTYPE html>
  <html>
  <head><style>${baseStyles}</style></head>
  <body>
    <div style="padding: 24px; background: #f8f6f3;">
      <div class="wrapper">
        <div class="header">
          <h1>SHUDDHAM</h1>
          <p>Order Confirmation</p>
        </div>

        <div class="body-content">
          <p style="font-size:18px; color:#2d5016; font-weight:600;">Namaste, ${firstName}! 🙏</p>
          <p style="font-size:15px; color:#555; line-height:1.6;">
            Thank you for your order. We've received it and will begin preparing your items with care.
            Your wellness journey continues!
          </p>

          <div style="text-align:center; margin:24px 0;">
            <span class="badge" style="font-size:14px; padding:8px 20px;">Order ${order.orderNumber}</span>
            <span class="badge" style="font-size:14px; padding:8px 20px; margin-left:8px;">${order.paymentGateway.toUpperCase()}</span>
          </div>

          <!-- Customer Info -->
          <div class="section-title">👤 Your Details</div>
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 12px 6px 0; font-size:13px; color:#8a8577; font-weight:600; width:120px;">Name</td>
              <td style="padding:6px 0; font-size:14px; color:#333;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0; font-size:13px; color:#8a8577; font-weight:600;">Email</td>
              <td style="padding:6px 0; font-size:14px; color:#333;">${customer?.email ?? "N/A"}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0; font-size:13px; color:#8a8577; font-weight:600;">Phone</td>
              <td style="padding:6px 0; font-size:14px; color:#333;">${customer?.phone ?? "N/A"}</td>
            </tr>
          </table>

          <!-- Order Items -->
          <div class="section-title">Your Items</div>
          ${buildItemsTable(order.items, order.currency)}

          <!-- Cost Breakdown -->
          <div class="section-title">Payment Summary</div>
          ${buildTotals(order)}

          <!-- Delivery Address -->
          <div class="section-title">📦 Delivering To</div>
          ${address ? buildAddressBlock(address) : '<p style="color:#8a8577;">No address on file.</p>'}

          <!-- Next Steps -->
          <div class="highlight-box" style="text-align:center; border-left-color:#2d5016; margin-top:32px;">
            <p style="margin:0 0 8px 0; font-weight:700; color:#2d5016;">What happens next?</p>
            <p style="margin:0; font-size:13px; color:#555; line-height:1.6;">
              We'll process your order shortly. You'll receive shipping updates via email.
              For any questions, reach out to us via <strong>WhatsApp</strong> or <strong>Support Mail</strong> in your dashboard.
            </p>
          </div>

          <p style="font-size:12px; color:#8a8577; margin-top:24px; text-align:center;">
            Order placed on ${new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" })}
          </p>
        </div>

        <div class="footer">
          <p><strong>SHUDDHAM Wellness</strong> – Pure. Natural. Timeless.</p>
          <p>This is an automated confirmation for your records.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const { error } = await customerResend.emails.send({
      from: SENDER,
      to: [customer.email],
      subject: `✅ Order Confirmed – ${order.orderNumber} | SHUDDHAM Wellness`,
      html,
    });

    if (error) {
      console.error("[Email] Customer confirmation failed:", error);
    } else {
      console.log(`[Email] Customer confirmation sent to ${customer.email} for ${order.orderNumber}`);
    }
  } catch (err) {
    console.error("[Email] Customer confirmation error:", err);
  }
};
