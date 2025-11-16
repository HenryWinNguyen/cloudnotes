"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", external: false },
  { href: "/settings", label: "Settings", external: false },
  { href: "https://github.com/HenryWinNguyen/cloudnotes", label: "GitHub", external: true },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 text-xs sm:text-sm">
      {links.map((link) => {
        const isActive =
          !link.external &&
          (pathname === link.href || pathname?.startsWith(link.href + "/"));

        const baseClasses =
          "transition-opacity hover:opacity-100";
        const activeClasses = isActive ? "opacity-100" : "opacity-60";

        if (link.external) {
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClasses} ${activeClasses}`}
            >
              {link.label}
            </a>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${baseClasses} ${activeClasses}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
