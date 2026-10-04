"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import Image from "next/image";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Used until the details are filled in from the admin panel.
const DEFAULTS = {
  name: "ড. অহিদুর রহমান",
  designation: "বিভাগীয় প্রধান",
  quote:
    "জ্ঞান, অনুসন্ধান ও ব্যবহারিক শিক্ষার সমন্বয়ে আমরা এমন একটি শিক্ষার পরিবেশ গড়ে তুলতে চাই, যেখানে শিক্ষার্থীরা নিজেদের সম্ভাবনাকে আবিষ্কার ও বিকশিত করার সুযোগ পায়।",
  message:
    "রসায়ন বিভাগের পক্ষ থেকে সকল শিক্ষার্থী, অভিভাবক এবং আগ্রহী দর্শনার্থীকে আন্তরিক স্বাগতম। আমাদের লক্ষ্য হলো মানসম্মত একাডেমিক শিক্ষা, ব্যবহারিক দক্ষতা এবং অনুসন্ধানী মানসিকতার বিকাশে একটি সুন্দর ও সহায়ক পরিবেশ তৈরি করা।",
  image: "/images/dept-head/dept-head.jpeg",
};

function HeadPhoto({
  src,
  alt,
  remote,
}: {
  src: string;
  alt: string;
  remote: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-white/10" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        priority
        unoptimized={remote}
        sizes="(max-width: 768px) 30vw, 32vw"
        onLoad={() => setLoaded(true)}
        className={`object-contain object-center transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

export default function HeadMessage() {
  const { settings, loading } = useSiteSettings();

  // Wait for the server answer so the built-in sample text and photo
  // never flash before the real ones appear.
  const ready = !loading;

  const name = settings?.head_name || DEFAULTS.name;
  const designation =
    settings?.head_designation || DEFAULTS.designation;
  const quote = settings?.head_quote || DEFAULTS.quote;
  const message = settings?.head_message || DEFAULTS.message;
  const remoteImage = settings?.head_image_url ?? null;
  const imageSrc = remoteImage || DEFAULTS.image;

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animation ekbar hoye gele observer bondho hobe (Performance boost)
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-screen pb-6 overflow-hidden">
      <div className="bg-[var(--igc-green)] shadow-sm p-4 sm:p-8 lg:p-10">
        <div className="grid lg:grid-cols-[32%_68%] items-center gap-6 lg:gap-0">
          
          {/* Department Head Photo */}
          <div
            className={`relative h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[390px] transform-gpu transition-all duration-900 ease-out ${
              isVisible 
                ? "opacity-100 translate-x-0 translate-y-0" 
                : "opacity-0 -translate-x-8 translate-y-4"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            {ready ? (
              <HeadPhoto
                key={imageSrc}
                src={imageSrc}
                alt={name}
                remote={Boolean(remoteImage)}
              />
            ) : (
              <div className="absolute inset-0 animate-pulse rounded-lg bg-white/10" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={`relative flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 transform-gpu transition-all duration-700 delay-150 ease-out ${
              isVisible 
                ? "opacity-100 translate-x-0 translate-y-0" 
                : "opacity-0 translate-x-8 translate-y-4"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Quote Icon */}
            <div
              className={`absolute right-6 top-6 text-green-100 sm:right-6 transform-gpu transition-all duration-500 delay-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              <Quote size={52} strokeWidth={1.2} color="white" />
            </div>

            {!ready && (
              <div className="relative max-w-3xl animate-pulse space-y-4">
                <div className="h-4 w-40 rounded bg-white/20" />
                <div className="h-8 w-3/4 rounded bg-white/20" />
                <div className="h-20 w-full rounded bg-white/10" />
                <div className="h-24 w-full rounded bg-white/10" />
                <div className="h-5 w-48 rounded bg-white/20" />
              </div>
            )}

            {ready && (
            <div className="relative max-w-3xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-white sm:text-[15px]">
                Message from the Head
              </p>

              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                রসায়ন বিভাগে আপনাকে স্বাগতম
              </h2>

              <blockquote className="mt-5 lg:border-l-4 lg:border-[#1b5e20] lg:pl-4 lg:text-lg font-medium lg:leading-8 text-white sm:text-lg whitespace-pre-line">
                “{quote.replace(/^[“"]|[”"]$/g, "")}”
              </blockquote>

              <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-white sm:text-[15px]">
                {message}
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-lg text-white tracking-wide">
                  {name}
                </p>
                <p className="font-semibold text-emerald-400 text-sm md:text-base">
                  {designation}
                </p>
                <p className="mt-1 text-xs md:text-sm text-emerald-50/70">
                  রসায়ন বিভাগ , ঈশ্বরদী সরকারি কলেজ
                </p>
              </div>
            </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}