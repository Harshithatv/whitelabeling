export default function PortalPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome to your branded portal</h1>
        <p className="mt-2 text-sm text-slate-500">
          This content is served based on the domain you used.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Status</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Active</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Environment</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Production</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Access</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Custom domain enabled</p>
          </div>
        </div>
      </div>
    </section>
  );
}
