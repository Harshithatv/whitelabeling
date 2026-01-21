import { headers } from "next/headers";
import { getTenant } from "../../../../lib/tenant";

export default async function TenantDetailsPage() {
  const h = await headers();
  const host = h.get("host") || "";
  const tenant = await getTenant(host);
 
  
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tenant Details</h1>
        <p className="mt-2 text-sm text-slate-500">
          This page confirms tenant data and navigation works on the client domain.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Tenant Name</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {tenant?.name || "Default Platform"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">App Name</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {tenant?.branding?.appName || "Default Platform"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Support Email</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {tenant?.branding?.supportEmail || "support@platform.local"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Primary Color</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span
                className="inline-block h-3 w-3 rounded-full border border-slate-200"
                style={{ background: tenant?.branding?.primaryColor || "#1f2937" }}
              />
              {tenant?.branding?.primaryColor || "#1f2937"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
