"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ClientProfile = {
  email: string;
  tenant: {
    name: string;
    slug?: string | null;
    branding?: {
      appName?: string | null;
      primaryColor?: string | null;
      supportEmail?: string | null;
      logoUrl?: string | null;
    } | null;
  };
};

export default function ClientDetailsPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("client_token");
    if (!token) {
      router.push("/client/login");
      return;
    }

    const load = async () => {
      const res = await fetch("/api/client/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem("client_token");
        router.push("/client/login");
        return;
      }
      const data = await res.json();
      setProfile(data);
    };

    load();
  }, [router]);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-500">Loading client details…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Client Details</h1>
          <p className="mt-2 text-sm text-slate-500">
            Logged in as <span className="font-medium">{profile.email}</span>
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Client Name</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {profile.tenant.name}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Subdomain</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {profile.tenant.slug || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">App Name</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {profile.tenant.branding?.appName || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Email</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {profile.tenant.branding?.supportEmail || "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                localStorage.removeItem("client_token");
                router.push("/client/login");
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
