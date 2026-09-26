import {
  Quote,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function HeadMessage() {
  return (

    // head message full section
    <section className="mx-auto max-w-[1500px] px-4 pb-5 lg:px-6">
      <div className="overflow-hidden border border-gray-100 bg-[var(--igc-green)] shadow-sm p-6 sm:p-8 lg:p-12">
        <div className="grid lg:grid-cols-[32%_68%]">

          {/* Department Head Photo */}
          <div className="relative min-h-[300px] bg-gray-100 sm:min-h-[360px] lg:min-h-[390px] p-6 pl-8 sm:p-0 lg:pr-0">
                  <Image
                    src="/images/dept-head/dept-head.jpeg"
                    alt="Department Head"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 100vw" 
                    // className="mx-auto h-full w-full object-cover"
                  />
          </div>

          {/* Message */}
          <div className="relative flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute right-6 top-6 text-green-100 sm:right-6">
              <Quote
                size={52}
                strokeWidth={1.2}
                color="white"
              />
            </div>

            <div className="relative max-w-3xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-white sm:text-[15px]">
                Message from the Head
              </p>

              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                রসায়ন বিভাগে আপনাকে স্বাগতম
              </h2>

              <blockquote className="mt-5 border-l-4 border-[#1b5e20] pl-4 text-base font-medium leading-8 text-white sm:text-lg">
                “জ্ঞান, অনুসন্ধান ও ব্যবহারিক শিক্ষার সমন্বয়ে
                আমরা এমন একটি শিক্ষার পরিবেশ গড়ে তুলতে চাই,
                যেখানে শিক্ষার্থীরা নিজেদের সম্ভাবনাকে আবিষ্কার
                ও বিকশিত করার সুযোগ পায়।”
              </blockquote>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white sm:text-[15px]">
                রসায়ন বিভাগের পক্ষ থেকে সকল শিক্ষার্থী, অভিভাবক
                এবং আগ্রহী দর্শনার্থীকে আন্তরিক স্বাগতম। আমাদের
                লক্ষ্য হলো মানসম্মত একাডেমিক শিক্ষা, ব্যবহারিক
                দক্ষতা এবং অনুসন্ধানী মানসিকতার বিকাশে একটি
                সুন্দর ও সহায়ক পরিবেশ তৈরি করা।
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="font-semibold text-white">
                  বিভাগীয় প্রধান
                </p>

                <p className="mt-1 text-sm text-white">
                  রসায়ন বিভাগ
                </p>

                <p className="mt-1 text-xs text-white">
                  ঈশ্বরদী সরকারি কলেজ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}