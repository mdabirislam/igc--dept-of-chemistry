import type { Metadata } from "next";

import GalleryPage from "@/components/gallery/GalleryPage";

export const metadata: Metadata = {
  title: "ভিডিও গ্যালারি | রসায়ন বিভাগ",
};

export default function Page() {
  return (
    <GalleryPage
      category="video"
      title="ভিডিও গ্যালারি"
      subtitle="রসায়ন বিভাগের অনুষ্ঠান ও কার্যক্রমের ভিডিও"
      emptyText="এখনো কোনো ভিডিও যোগ করা হয়নি।"
    />
  );
}
