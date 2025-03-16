import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnityVerse",
  description: "For Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
    <Navbar/>
    <main className="relative overflow-hidden">
      {children}

      {/*<script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>*/}
      {/*<script src="https://files.bpcontent.cloud/2025/02/08/16/20250208164144-N49YNY0D.js"></script>*/}

    </main>
    {/*<Footer/>*/}
    </body>
    </html>
  );
}
