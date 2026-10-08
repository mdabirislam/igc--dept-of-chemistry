import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "শিক্ষকবৃন্দ | রসায়ন বিভাগ",
  description:
    "ঈশ্বরদী সরকারি কলেজের রসায়ন বিভাগের শিক্ষক ও কর্মকর্তাবৃন্দ।",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
