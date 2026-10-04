"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Images, Video } from "lucide-react";

import FadeImage from "@/components/common/FadeImage";
import { apiFetch } from "@/lib/api";
import type { GalleryItem } from "@/types/api";

const PREVIEW_COUNT = 6;

const links = [
  {
    label: "ছবিঘর",
    href: "/gallery/photo",
    icon: Images,
  },
  {
    label: "ভিডিও গ্যালারি",
    href: "/gallery/video",
    icon: Video,
  },
  {
    label: "দেয়ালিকা",
    href: "/gallery/wall-magazine",
    icon: BookOpen,
  },
];

export default function GalleryPreview() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<GalleryItem[]>(
          "/gallery/?category=photo"
        );

        setPhotos(
          data
            .filter((item) => item.image_url)
            .slice(0, PREVIEW_COUNT)
        );
      } catch {
        // The link cards below are still shown.
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <section className="mx-auto max-w-screen">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-transparent shadow-sm">
        {/* Title */}
        <div className="mb-2 border-b border-gray-100 px-5 py-4 text-center sm:px-6">
          <h2
            className="relative w-full p-3 text-center text-xl font-bold text-gray-800 after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-1/3 after:-translate-x-1/2 after:bg-[#1b5e20] sm:p-1 sm:text-2xl lg:pb-4"
          >
            গ্যালারি
          </h2>
        </div>

        {/* Latest photos */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 p-4 sm:p-5 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: PREVIEW_COUNT }).map(
              (_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-lg bg-slate-200/60"
                />
              )
            )}
          </div>
        ) : (
          photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-5 md:grid-cols-3 lg:grid-cols-6">
              {photos.map((photo, index) => (
                <Link
                  key={photo.id}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index, 8) * 70}
                  href="/gallery/photo"
                  className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 shadow-sm"
                >
                  <FadeImage
                    src={photo.image_url as string}
                    alt={photo.title}
                    className="absolute inset-0"
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="line-clamp-1">
                      {photo.title}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )
        )}

        {/* Links to every gallery section */}
        <div className="grid gap-3 border-t border-gray-100 p-4 sm:grid-cols-3 sm:p-5">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-center gap-2 rounded-lg border border-gray-100 bg-[#f7f9fb] px-4 py-3.5 text-sm font-semibold text-gray-700 transition duration-200 hover:border-green-100 hover:bg-green-50/40 hover:text-[#1b5e20] hover:shadow-sm"
            >
              <Icon size={17} className="text-[#1b5e20]" />
              {label}
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
