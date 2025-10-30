"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "./user-dropdown";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-18 items-center mx-auto px-4 md:px-6 lg:px-8">
        {/* Left side - Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>

        {/* Center - Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="font-bold text-2xl tracking-wider">
            GENERAL SUITABILITY
          </Link>
        </div>

        {/* Right side - User Dropdown */}
        <div className="flex items-center">
          {isPending ? null : session ? (
            <UserDropdown
              email={session.user.email}
              image={
                session?.user.image ??
                `https://avatar.vercel.sh/${session?.user.email}`
              }
              name={
                session?.user.name && session.user.name.length > 0
                  ? session.user.name
                  : session?.user.email.split("@")[0]
              }
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
