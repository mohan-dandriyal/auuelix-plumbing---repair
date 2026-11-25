import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Hero, Footer } from "@/types/template.type";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: Footer.logoAlt,
  description: Hero.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={`${roboto.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}