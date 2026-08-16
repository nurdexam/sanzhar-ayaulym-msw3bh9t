import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { InvitationData } from "@/types/invitation";
import invitation from "@/public/data/invitation.json";

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
});

const nautilus = localFont({
  src: "../public/fonts/artist.otf",
  variable: "--font-nautilus",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `💍 ${invitation.groom} & ${invitation.bride}`,
  description: `💍 ${invitation.groom} & ${invitation.bride} — үйлену тойына шақыру`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="kk"
      className={cn(
        "h-full",
        "antialiased",
        nautilus.variable,
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        cormorant.variable,
        manrope.variable
      )}
    >
      <body className="min-h-full flex flex-col font-nautilus">
        {children}
      </body>
    </html>
  );
}
