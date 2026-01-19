"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", data.token);
    router.push("/admin/tenants");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Superadmin</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in to manage tenants</h1>
          <p className="mt-2 text-sm text-slate-500">
            Use your superadmin credentials to access the dashboard.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
              placeholder="admin@platform.local"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
              placeholder="********"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={login}
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
