"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const data = await apiFetch("/client/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("client_token", data.token);
      router.push("/client/details");
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-slate-900">Client Login</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Sign in to view your client details.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={login}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
