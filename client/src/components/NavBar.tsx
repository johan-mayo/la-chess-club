"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <div className="bg-red-700 py-2 md:px-20 px-10 flex items-center justify-between font-bold">
      <h1 className="cinzel-400">LA Chess Club</h1>
      {!pathname.includes("sign-in") && (
        <SignedOut>
          <SignInButton />
        </SignedOut>
      )}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default NavBar;
