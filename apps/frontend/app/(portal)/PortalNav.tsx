"use client";

import { usePathname } from "next/navigation";

export default function PortalNav() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    [
      "rounded-md px-3 py-2 text-sm transition",
      pathname === href ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100",
    ].join(" ");

  return (
    <nav className="mt-4 flex gap-4">
      <a className={linkClass("/portal")} href="/portal">
        Overview
      </a>
      <a className={linkClass("/portal/details")} href="/portal/details">
        Client Details
      </a>
    </nav>
  );
}
