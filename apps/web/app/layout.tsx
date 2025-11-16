import "./globals.css";
import { NavLinks } from "./nav-links";
import Link from "next/link";

export const metadata = {
  title: "CloudNotes",
  description: "Runnable notes in the cloud",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <header className="border-b border-white/10">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold tracking-wide">
              CloudNotes
            </Link>

            {/* ✔️ Use your reusable links component */}
            <NavLinks />

          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
