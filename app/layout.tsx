import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 px-6 py-4">
                <div className="mx-auto max-w-5xl text-sm text-zinc-500">
                  TradersAO
                </div>
              </nav>
            }
          >
            <Navbar />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
