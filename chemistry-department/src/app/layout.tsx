import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "রসায়ন বিভাগ | ঈশ্বরদী সরকারি কলেজ",
  description:
    "ঈশ্বরদী সরকারি কলেজের রসায়ন বিভাগের একাডেমিক ও তথ্যভিত্তিক ওয়েবসাইট।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        {children}
      </body>
    </html>
  );
}