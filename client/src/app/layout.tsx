import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import NavBar from "@/components/NavBar";

const cinzel = Cinzel({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LA Chess Club",
  description: "Chess clubs hosted in Los Angeles every thursday!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cinzel.className}>
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
