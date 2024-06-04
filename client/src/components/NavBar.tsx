"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const isAuthenticating =
    pathname.includes("sign-in") || pathname.includes("sign-up");
  return (
    <div
      className={`bg-red-700 py-3 md:px-20 px-10 min-h-16 flex items-center justify-between font-bold z-50 shadow-2xl`}
    >
      <h1
        className={`cinzel-400 ${isAuthenticating ? "text-center w-full" : "text-left"}`}
      >
        <Link href={"/"}>LA Chess Club</Link>
      </h1>

      {!isAuthenticating && (
        <div className="text-white">
          <SignedOut>
            <SignInButton>Sign In</SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </div>
  );
};

export default NavBar;
