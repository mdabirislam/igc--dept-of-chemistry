import AosProvider from "@/components/common/AosProvider";
import SiteLoader from "@/components/common/SiteLoader";
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
        {/* Without JavaScript the splash screen would never close. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "#site-loader{display:none!important}",
            }}
          />
        </noscript>

        <SiteLoader />

        <AosProvider>
          {children}
        </AosProvider>
      </body>
    </html>
  );
}