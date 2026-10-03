import type { Metadata } from "next";

import GalleryPage from "@/components/gallery/GalleryPage";

export const metadata: Metadata = {
  title: "দেয়ালিকা | রসায়ন বিভাগ",
};

export default function Page() {
  return (
    <GalleryPage
      category="wall_magazine"
      title="দেয়ালিকা"
      subtitle="শিক্ষার্থীদের সৃজনশীল লেখা ও দেয়ালিকা সংকলন"
      emptyText="এখনো কোনো দেয়ালিকা যোগ করা হয়নি।"
    />
  );
}
