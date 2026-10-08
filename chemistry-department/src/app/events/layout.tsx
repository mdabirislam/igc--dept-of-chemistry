import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ইভেন্ট | রসায়ন বিভাগ",
  description:
    "রসায়ন বিভাগের অনুষ্ঠান ও গুরুত্বপূর্ণ কার্যক্রমের তালিকা।",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
