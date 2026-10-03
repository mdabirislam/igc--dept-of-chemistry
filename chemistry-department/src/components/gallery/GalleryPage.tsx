"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Play,
  X,
} from "lucide-react";

import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import { apiFetch } from "@/lib/api";
import type { GalleryCategory, GalleryItem } from "@/types/api";

interface GalleryPageProps {
  category: GalleryCategory;
  title: string;
  subtitle: string;
  emptyText: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** YouTube thumbnail for a watch / share link, or null for other sites. */
function youtubeThumbnail(url: string): string | null {
  try {
    const parsed = new URL(url);
    let id: string | null = null;

    if (parsed.hostname === "youtu.be") {
      id = parsed.pathname.slice(1);
    } else if (parsed.hostname.endsWith("youtube.com")) {
      id =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean).pop() ||
        null;
    }

    return id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
}

export default function GalleryPage({
  category,
  title,
  subtitle,
  emptyText,
}: GalleryPageProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const isVideo = category === "video";
  const isWall = category === "wall_magazine";

  useEffect(() => {
    async function load() {
      try {
        setItems(
          await apiFetch<GalleryItem[]>(
            `/gallery/?category=${category}`
          )
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "গ্যালারি লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [category]);

  const close = useCallback(() => setSelected(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setSelected((current) =>
        current === null || items.length === 0
          ? current
          : (current + direction + items.length) % items.length
      );
    },
    [items.length]
  );

  useEffect(() => {
    if (selected === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close, step]);

  const current = selected !== null ? items[selected] : null;

  return (
    <PublicSiteLayout>
      <main className="min-h-screen bg-[#f7f9fb]">
        <section className="bg-[#1a3a5c] text-white">
          <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
            >
              <ChevronLeft size={16} />
              হোমে ফিরে যান
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Images size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="mt-1 text-sm text-white/75">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
          {loading ? (
            <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
              লোড হচ্ছে...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
              {emptyText}
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                isWall
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {items.map((item, index) => {
                const thumb = isVideo
                  ? youtubeThumbnail(item.video_url)
                  : item.image_url;

                const card = (
                  <>
                    <div
                      className={`relative overflow-hidden bg-gray-100 ${
                        isWall ? "aspect-[3/4]" : "aspect-[4/3]"
                      }`}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <Play size={40} />
                        </div>
                      )}

                      {isVideo && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#1b5e20] shadow">
                            <Play size={22} className="ml-0.5" />
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h2 className="line-clamp-2 text-sm font-bold text-gray-800">
                        {item.title}
                      </h2>

                      {item.date && (
                        <p className="mt-1 text-xs font-medium text-[#1b5e20]">
                          {formatDate(item.date)}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                          {item.description}
                        </p>
                      )}

                      {isVideo && (
                        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1b5e20]">
                          ভিডিও দেখুন
                          <ExternalLink size={12} />
                        </p>
                      )}
                    </div>
                  </>
                );

                const cardClass =
                  "group block overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";

                return isVideo ? (
                  <a
                    key={item.id}
                    href={item.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {card}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(index)}
                    className={cardClass}
                  >
                    {card}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Lightbox */}
        {current?.image_url && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
          >
            <button
              type="button"
              onClick={close}
              aria-label="বন্ধ করুন"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X size={22} />
            </button>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="আগের ছবি"
                  className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <ChevronLeft size={26} />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="পরের ছবি"
                  className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            <figure
              className="flex max-h-full max-w-5xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image_url}
                alt={current.title}
                className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain"
              />

              <figcaption className="mt-3 max-w-2xl text-center text-white">
                <p className="font-semibold">{current.title}</p>

                {current.description && (
                  <p className="mt-1 text-sm text-white/70">
                    {current.description}
                  </p>
                )}
              </figcaption>
            </figure>
          </div>
        )}
      </main>
    </PublicSiteLayout>
  );
}
