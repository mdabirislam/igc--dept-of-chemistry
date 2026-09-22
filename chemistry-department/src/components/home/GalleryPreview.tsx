import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Image,
  PlayCircle,
} from "lucide-react";

const galleryItems = [
  {
    title: "ফটো গ্যালারি",
    description: "বিভাগের বিভিন্ন কার্যক্রম, অনুষ্ঠান ও ক্যাম্পাসের নির্বাচিত ছবি।",
    href: "/gallery/photo",
    icon: Image,
  },
  {
    title: "ভিডিও গ্যালারি",
    description: "বিভাগের কার্যক্রম ও গুরুত্বপূর্ণ আয়োজনের ভিডিও সংগ্রহ।",
    href: "/gallery/video",
    icon: PlayCircle,
  },
];

export default function GalleryPreview() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 pb-5 lg:px-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <Camera
                size={20}
                strokeWidth={1.8}
                className="text-[#1b5e20]"
              />

              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                গ্যালারি
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              রসায়ন বিভাগের কার্যক্রম ও স্মরণীয় মুহূর্ত
            </p>
          </div>

          <Link
            href="/gallery/photo"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#1b5e20] transition hover:text-[#124516]"
          >
            সব দেখুন
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Gallery Items */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {galleryItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-lg border border-gray-100 bg-[#f7f9fb] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:shadow-sm sm:p-6"
              >
                <div className="flex min-h-[170px] flex-col justify-between">
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20] transition group-hover:bg-[#1b5e20] group-hover:text-white">
                      <Icon size={23} strokeWidth={1.7} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1b5e20]">
                    দেখুন
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Wall Magazine */}
        <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
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