import Link from "next/link";
import { ArrowRight } from "lucide-react";

const galleryItems = [
  {
    title: "ফটো গ্যালারি",
    href: "/gallery/photo",
  },
  {
    title: "ভিডিও গ্যালারি",
    href: "/gallery/video",
  },
];

export default function GalleryPreview() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 pb-5 lg:px-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Simple Centered Title */}
        <div className="border-b border-gray-100 px-5 py-4 text-center sm:px-6">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            গ্যালারি
          </h2>
        </div>

        {/* Gallery Items */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {galleryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-[130px] items-center justify-center rounded-lg border border-gray-100 bg-[#f7f9fb] p-5 transition duration-200 hover:border-green-100 hover:bg-green-50/30 hover:shadow-sm"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>

                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#1b5e20]">
                  দেখুন
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Wall Magazine */}
        <div className="border-t border-gray-100 px-5 py-3 text-center sm:px-6">
          <Link
            href="/gallery/wall-magazine"
            className="group inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-[#1b5e20]"
          >
            <span className="font-medium">দেয়ালিকা</span>
            <span className="text-gray-400">•</span>
            <span>আরও দেখতে</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}