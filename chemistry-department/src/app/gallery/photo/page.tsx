import type { Metadata } from "next";

import GalleryPage from "@/components/gallery/GalleryPage";

export const metadata: Metadata = {
  title: "ছবিঘর | রসায়ন বিভাগ",
};

export default function Page() {
  return (
    <GalleryPage
      category="photo"
      title="ছবিঘর"
      subtitle="রসায়ন বিভাগের বিভিন্ন অনুষ্ঠান ও মুহূর্তের ছবি"
      emptyText="এখনো কোনো ছবি যোগ করা হয়নি।"
    />
  );
}
