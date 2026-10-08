import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "শিক্ষাসামগ্রী ও রিসোর্স | রসায়ন বিভাগ",
  description:
    "শিক্ষার্থীদের জন্য প্রয়োজনীয় শিক্ষা উপকরণ ও রিসোর্স।",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
