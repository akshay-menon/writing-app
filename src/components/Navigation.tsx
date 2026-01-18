"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/actions";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/patterns", label: "Patterns" },
];

interface NavigationProps {
  userEmail?: string | null;
}

export function Navigation({ userEmail }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-lg text-stone-900 dark:text-stone-100"
        >
          Writing Practice
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href
                  ? "text-stone-900 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {userEmail && (
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
