import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import BottomNavigation from "@/components/BottomNav";
import { ShowNavProvider } from "@/hooks/showNav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Raet",
  description: "Dating app",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClerkLoading />
          <ClerkLoaded>
            <ShowNavProvider>
              <div className="flex flex-col justify-between ">
                <div className="h-[90vh] ">{children}</div>
                <BottomNavigation />
              </div>
            </ShowNavProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
