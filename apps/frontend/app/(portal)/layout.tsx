import { headers } from "next/headers";
import { getTenant } from "../../lib/tenant";
import PortalNav from "./PortalNav";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const host = h.get("host") || "";
  const tenant = await getTenant(host);

  const branding = tenant?.branding || {
    appName: "Default Platform",
    logoUrl: "/default-logo.svg",
    primaryColor: "#1f2937",
    supportEmail: "support@platform.local",
  };
  const tenantName = tenant?.name || branding.appName;
  const backendBase =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";
  const logoSrc = branding.logoUrl?.startsWith("/uploads")
    ? `${backendBase}${branding.logoUrl}`
    : branding.logoUrl || "/default-logo.svg";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header
        className="border-b"
        style={{ background: `${branding.primaryColor}12`, borderColor: `${branding.primaryColor}33` }}
      >
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border"
              style={{ borderColor: branding.primaryColor, background: `${branding.primaryColor}1A` }}
            >
              <img
                src={logoSrc}
                alt={`${tenantName} logo`}
                className="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Client Portal</p>
              <h1 className="text-2xl font-semibold text-slate-900">{tenantName}</h1>
              <p className="text-sm text-slate-500">{branding.appName}</p>
            </div>
          </div>
          <PortalNav />
          <div className="mt-4 h-1 w-24 rounded-full" style={{ background: branding.primaryColor }} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-sm text-slate-500">
            <span>Email: {branding.supportEmail}</span>
          <span>Powered by WhiteLabel</span>
        </div>
      </footer>
    </div>
  );
}
