import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড | রসায়ন বিভাগ",
  description:
    "ঈশ্বরদী সরকারি কলেজের রসায়ন বিভাগের সর্বশেষ বিজ্ঞপ্তি ও গুরুত্বপূর্ণ ঘোষণা।",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
