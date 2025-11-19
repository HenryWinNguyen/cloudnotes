// app/layout.tsx
import "./globals.css";
import { NavLinks } from "./nav-links";
import Link from "next/link";
import BackgroundHalo from "@/components/BackgroundHalo";

export const metadata = {
  title: "CloudNotes",
  description: "Runnable notes in the cloud",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#020617,_#000000)] text-slate-50">
        {/* Soft animated gradient halos behind everything */}
        <BackgroundHalo />

        {/* Main app content sits above the background halos */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="border-b border-white/10 bg-black/70 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link
                href="/"
                className="text-sm font-semibold tracking-wide text-sky-300 hover:text-sky-100"
              >
                CloudNotes
              </Link>

              <NavLinks />
            </div>
          </header>

          {/* full width main, no max-w wrapper */}
          <main className="flex-1 px-4 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
