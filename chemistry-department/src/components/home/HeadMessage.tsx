import {
  Quote,
  Sparkles,
} from "lucide-react";

export default function HeadMessage() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 pb-5 lg:px-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[30%_70%]">
          {/* Department Head Photo */}
          <div className="relative min-h-[300px] bg-gray-100 sm:min-h-[360px] lg:min-h-[390px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white bg-green-50 text-[#1b5e20] shadow-md sm:h-48 sm:w-48">
                <div className="text-center">
                  <Sparkles
                    size={38}
                    strokeWidth={1.5}
                    className="mx-auto mb-2"
                  />

                  <p className="text-sm font-medium">
                    Department Head
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Photo will be added
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="relative flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute right-6 top-6 text-green-100 sm:right-8">
              <Quote
                size={52}
                strokeWidth={1.2}
              />
            </div>

            <div className="relative max-w-3xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#1b5e20]">
                Message from the Head
              </p>

              <h2 className="text-2xl font-bold leading-tight text-gray-800 sm:text-3xl">
                রসায়ন বিভাগে আপনাকে স্বাগতম
              </h2>

              <blockquote className="mt-5 border-l-4 border-[#1b5e20] pl-4 text-base font-medium leading-8 text-gray-700 sm:text-lg">
                “জ্ঞান, অনুসন্ধান ও ব্যবহারিক শিক্ষার সমন্বয়ে
                আমরা এমন একটি শিক্ষার পরিবেশ গড়ে তুলতে চাই,
                যেখানে শিক্ষার্থীরা নিজেদের সম্ভাবনাকে আবিষ্কার
                ও বিকশিত করার সুযোগ পায়।”
              </blockquote>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-[15px]">
                রসায়ন বিভাগের পক্ষ থেকে সকল শিক্ষার্থী, অভিভাবক
                এবং আগ্রহী দর্শনার্থীকে আন্তরিক স্বাগতম। আমাদের
                লক্ষ্য হলো মানসম্মত একাডেমিক শিক্ষা, ব্যবহারিক
                দক্ষতা এবং অনুসন্ধানী মানসিকতার বিকাশে একটি
                সুন্দর ও সহায়ক পরিবেশ তৈরি করা।
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-800">
                  বিভাগীয় প্রধান
                </p>

                <p className="mt-1 text-sm text-[#1b5e20]">
                  রসায়ন বিভাগ
                </p>

                <p className="mt-1 text-xs text-gray-500">
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