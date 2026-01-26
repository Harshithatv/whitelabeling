export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-6 md:flex">
          <div className="text-lg font-semibold text-slate-900">WhiteLabel Admin</div>
          <nav className="mt-8 space-y-3 text-sm text-slate-600">
            <a className="block rounded-md px-3 py-2 hover:bg-slate-100" href="/admin/tenants">
              Clients
            </a>
            <a className="block rounded-md px-3 py-2 hover:bg-slate-100" href="/admin/login">
              Log out
            </a>
          </nav>
        </aside>
        <main className="flex-1 bg-slate-50 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
