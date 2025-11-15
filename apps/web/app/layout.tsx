import "./globals.css";
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
            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="opacity-80 hover:opacity-100">Dashboard</Link>
              <Link href="/settings" className="opacity-80 hover:opacity-100">Settings</Link>
              <a href="https://github.com/HenryWinNguyen/cloudnotes" className="opacity-80 hover:opacity-100">GitHub</a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
