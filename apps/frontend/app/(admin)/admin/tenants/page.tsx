"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";

type Tenant = {
  id: string;
  name: string;
  slug?: string | null;
  domains?: { hostname: string }[];
  clientUser?: { email?: string | null } | null;
  branding?: {
    appName?: string | null;
    primaryColor?: string | null;
    supportEmail?: string | null;
    logoUrl?: string | null;
  } | null;
};

export default function ClientsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    domain: "",
    appName: "",
    primaryColor: "",
    email: "",
    clientPassword: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const backendBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:4000";

  const load = async () => {
    const data = await apiFetch("/admin/tenants", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTenants(data);
  };

  useEffect(() => {
    load();
  }, []);

  const createTenant = async () => {
    if (!form.name && !form.slug) {
      alert("Client name or subdomain is required");
      return;
    }
    if (!form.email || !form.clientPassword) {
      alert("Client email and password are required");
      return;
    }
    const created = await apiFetch("/admin/tenants", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        domain: form.domain,
        client: {
          email: form.email,
          password: form.clientPassword,
        },
        branding: {
          appName: form.appName,
          primaryColor: form.primaryColor,
          supportEmail: form.email,
        },
      }),
    });
    if (logoFile && created?.id) {
      const formData = new FormData();
      formData.append("file", logoFile);
      await fetch(`/api/admin/tenants/logo?tenantId=${created.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }
    await load();
    alert("Tenant created");
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create a client</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add client branding and connect a custom domain or a wildcard subdomain.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Client name</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="Acme Inc"
              value={form.name}
              onChange={e => {
                const name = e.target.value;
                setForm(prev => ({
                  ...prev,
                  name,
                  slug: slugEdited ? prev.slug : toSlug(name),
                }));
              }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Client subdomain</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="acme"
              value={form.slug}
              onChange={e => {
                setSlugEdited(true);
                setForm({ ...form, slug: toSlug(e.target.value) });
              }}
            />
            <p className="mt-1 text-xs text-slate-400">
              Used for wildcard domains like <code>clientname.yourdomain.com</code>.
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Domain</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="app.acme.com"
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">App name</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="Acme Portal"
              value={form.appName}
              onChange={e => setForm({ ...form, appName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Client email</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="client@acme.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Logo file (optional)</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              type="file"
              accept="image/*"
              onChange={e => setLogoFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Primary color</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="#4f46e5"
              value={form.primaryColor}
              onChange={e => setForm({ ...form, primaryColor: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Client password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
              placeholder="Set a password"
              value={form.clientPassword}
              onChange={e => setForm({ ...form, clientPassword: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Use a custom domain or rely on a wildcard domain for subdomains.
          </p>
          <button
            onClick={createTenant}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Create client
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Clients</h2>
        <p className="mt-1 text-sm text-slate-500">Connect domains and manage branding.</p>
        {tenants.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            No clients loaded yet.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3 pr-4">Client</th>
                  <th className="py-3 pr-4">Subdomain</th>
                  <th className="py-3 pr-4">Custom Domain</th>
                  <th className="py-3 pr-4">Client Email</th>
                  <th className="py-3 pr-4">App Name</th>
                  <th className="py-3 pr-4">Primary Color</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Logo</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => {
                  const logoSrc =
                    t.branding?.logoUrl?.startsWith("/uploads")
                      ? `${backendBase}${t.branding.logoUrl}`
                      : t.branding?.logoUrl || "";
                  return (
                  <tr key={t.id} className="border-b border-slate-100 text-slate-700">
                    <td className="py-3 pr-4 font-medium text-slate-900">{t.name}</td>
                    <td className="py-3 pr-4">{t.slug || "—"}</td>
                    <td className="py-3 pr-4">
                      {t.domains?.length ? t.domains[0].hostname : "—"}
                    </td>
                    <td className="py-3 pr-4">{t.clientUser?.email || "—"}</td>
                    <td className="py-3 pr-4">{t.branding?.appName || "—"}</td>
                    <td className="py-3 pr-4">
                      {t.branding?.primaryColor ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-slate-200"
                            style={{ background: t.branding.primaryColor || "#ffffff" }}
                          />
                          {t.branding.primaryColor}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 pr-4">{t.branding?.supportEmail || "—"}</td>
                    <td className="py-3 pr-4">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={`${t.name} logo`}
                          className="h-8 w-auto rounded"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
