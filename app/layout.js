import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Aegis Family Command Center | Optimize. Protect. Preserve.",
  description:
    "A single, powerful platform for all generations. Reclaim your vitality. Secure their independence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-bg-off-white text-navy">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
