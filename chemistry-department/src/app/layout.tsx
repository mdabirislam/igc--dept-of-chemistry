import AosProvider from "@/components/common/AosProvider";
import SiteLoader from "@/components/common/SiteLoader";
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    // Each page gets its own canonical URL, resolved against metadataBase.
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/images/banners/campus-01.jpg",
        width: 1024,
        height: 386,
        alt: "ঈশ্বরদী সরকারি কলেজ ক্যাম্পাস",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/banners/campus-01.jpg"],
  },
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