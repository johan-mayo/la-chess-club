"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const isAuthenticating =
    pathname.includes("sign-in") || pathname.includes("sign-up");
  return (
    <div
      className={`bg-red-700 py-2 md:px-20 px-10 flex items-center justify-between font-bold z-50`}
    >
      <h1
        className={`cinzel-400 ${isAuthenticating ? "text-center w-full" : "text-left"}`}
      >
        LA Chess Club
      </h1>
      {!isAuthenticating && (
        <div>
          <SignedOut>
            <SignInButton />
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
