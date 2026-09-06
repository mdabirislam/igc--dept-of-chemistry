import {
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
} from "lucide-react";

type Notice = {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  pdfUrl: string;
};

const notices: Notice[] = [
  {
    id: 1,
    title:
      "অনার্স ১ম বর্ষ (২০২৫-২০২৬) শিক্ষার্থীদের ওরিয়েন্টেশন বিষয়ে বিজ্ঞপ্তি",
    category: "গুরুত্বপূর্ণ",
    publishedAt: "০১/০৯/২০২৬",
    pdfUrl: "/documents/notices/notice-01.pdf",
  },
  {
    id: 2,
    title:
      "অনার্স ১ম বর্ষ পরীক্ষার বিষয়ে শিক্ষার্থীদের জন্য গুরুত্বপূর্ণ বিজ্ঞপ্তি",
    category: "বিজ্ঞপ্তি",
    publishedAt: "৩০/০৮/২০২৬",
    pdfUrl: "/documents/notices/notice-02.pdf",
  },
  {
    id: 3,
    title: "একাডেমিক কার্যক্রম সংক্রান্ত বিজ্ঞপ্তি",
    category: "নোটিশ",
    publishedAt: "২৮/০৮/২০২৬",
    pdfUrl: "/documents/notices/notice-03.pdf",
  },
  {
    id: 4,
    title: "শিক্ষার্থীদের ব্যবহারিক ক্লাস সংক্রান্ত বিজ্ঞপ্তি",
    category: "বিজ্ঞপ্তি",
    publishedAt: "২৭/০৮/২০২৬",
    pdfUrl: "/documents/notices/notice-04.pdf",
  },
  {
    id: 5,
    title: "সেমিনার: রসায়ন গবেষণা ও আধুনিক প্রয়োগ",
    category: "সেমিনার",
    publishedAt: "২৬/০৮/২০২৬",
    pdfUrl: "/documents/notices/notice-05.pdf",
  },
  {
    id: 6,
    title: "অনার্স ১ম বর্ষের ক্লাস রুটিন সংক্রান্ত বিজ্ঞপ্তি",
    category: "নোটিশ",
    publishedAt: "২৫/০৮/২০২৬",
    pdfUrl: "/documents/notices/notice-06.pdf",
  },
];

const categoryStyles: Record<string, string> = {
  গুরুত্বপূর্ণ: "bg-red-50 text-red-600 border-red-100",
  বিজ্ঞপ্তি: "bg-green-50 text-green-700 border-green-100",
  নোটিশ: "bg-blue-50 text-blue-700 border-blue-100",
  সেমিনার: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function NoticeSection() {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-3 sm:px-4">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-bold text-gray-800 sm:text-lg">
          <Bell
            size={18}
            className="shrink-0 text-[#1b5e20] sm:h-[19px] sm:w-[19px]"
          />

          <span className="truncate">সর্বশেষ নোটিশ</span>
        </h2>

        <a
          href="/notices"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-700 hover:underline sm:text-sm"
        >
          <span className="hidden sm:inline">সব নোটিশ দেখুন</span>
          <span className="sm:hidden">সব নোটিশ</span>
          <ChevronRight size={14} />
        </a>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
        <button
          type="button"
          className="rounded-full border border-[#006a35] bg-[#006a35] px-3 py-1 text-xs font-medium text-white sm:px-4 sm:py-1.5 sm:text-sm"
        >
          সব
        </button>

        {["গুরুত্বপূর্ণ", "বিজ্ঞপ্তি", "নোটিশ", "সেমিনার"].map(
          (category) => (
            <button
              key={category}
              type="button"
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 transition hover:border-[#006a35] hover:text-[#006a35] sm:px-4 sm:py-1.5 sm:text-sm"
            >
              {category}
            </button>
          ),
        )}
      </div>

      {/* Notice Table */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="overflow-hidden rounded-md border border-gray-200">
          <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
            {/* 
              Mobile:
              Serial = 48px
              Date   = 92px
              PDF    = 48px

              Desktop:
              Serial = 68px
              Date   = 125px
              PDF    = 78px
            */}
            <colgroup>
              <col className="w-[48px] sm:w-[68px]" />
              <col />
              <col className="w-[92px] sm:w-[125px]" />
              <col className="w-[48px] sm:w-[78px]" />
            </colgroup>

            <thead>
              <tr className="bg-gray-50 text-gray-800">
                {/* Serial */}
                <th className="border-b border-r border-gray-200 px-1.5 py-3 text-center font-bold sm:px-3 sm:py-3.5">
                  <span className="sm:hidden">নং</span>

                  <span className="hidden sm:inline">
                    ক্রমিক
                    <br />
                    নং
                  </span>
                </th>

                {/* Title */}
                <th className="border-b border-r border-gray-200 px-2 py-3 text-left font-bold sm:px-3 sm:py-3.5">
                  শিরোনাম
                </th>

                {/* Date */}
                <th className="border-b border-r border-gray-200 px-1 py-3 text-center font-bold sm:px-3 sm:py-3.5">
                  তারিখ
                </th>

                {/* PDF */}
                <th className="border-b border-gray-200 px-1 py-3 text-center font-bold sm:px-3 sm:py-3.5">
                  <span className="sm:hidden">PDF</span>

                  <span className="hidden sm:inline">
                    ডাউনলোড
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {notices.map((notice, index) => (
                <tr
                  key={notice.id}
                  className="group transition hover:bg-green-50/40"
                >
                  {/* Serial */}
                  <td className="border-b border-r border-gray-200 px-1.5 py-3 align-middle text-center text-gray-700 sm:px-3 sm:py-3.5">
                    {toBengaliNumber(index + 1)}
                  </td>

                  {/* Title */}
                  <td className="border-b border-r border-gray-200 px-2 py-3 align-middle sm:px-3 sm:py-3.5">
                    <div className="flex min-w-0 items-start gap-1.5 sm:items-center sm:gap-2.5">
                      <span
                        className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[9px] font-medium leading-4 sm:px-2 sm:py-0.5 sm:text-[11px] ${
                          categoryStyles[notice.category] ??
                          "border-gray-100 bg-gray-50 text-gray-600"
                        }`}
                      >
                        {notice.category}
                      </span>

                      <a
                        href={notice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 break-words text-[11px] leading-[1.55] text-gray-800 transition group-hover:text-green-700 hover:underline sm:text-sm sm:leading-6"
                      >
                        {notice.title}
                      </a>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="border-b border-r border-gray-200 px-1 py-3 align-middle text-center text-gray-700 sm:px-3 sm:py-3.5">
                    <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-[10px] leading-5 sm:gap-1.5 sm:text-sm">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.8}
                        className="shrink-0 text-gray-400 sm:h-[14px] sm:w-[14px]"
                      />

                      <span className="whitespace-nowrap">
                        {notice.publishedAt}
                      </span>
                    </div>
                  </td>

                  {/* PDF */}
                  <td className="border-b border-gray-200 px-1 py-3 text-center align-middle sm:px-3 sm:py-3.5">
                    <a
                      href={notice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      aria-label={`${notice.title} PDF download`}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-red-600 transition hover:bg-red-50 sm:p-2"
                    >
                      <FileText
                        size={22}
                        strokeWidth={1.8}
                        className="sm:h-6 sm:w-6"
                      />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* More Button */}
      <div className="px-3 pb-3 pt-0.5 sm:px-4 sm:pb-4 sm:pt-1">
        <a
          href="/notices"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#007a3d] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#006632] sm:gap-2 sm:px-5 sm:py-2 sm:text-sm"
        >
          আরও দেখুন
          <ChevronRight size={15} />
        </a>
      </div>
    </section>
  );
}

/**
 * Convert English numerals to Bengali numerals.
 */
function toBengaliNumber(value: number): string {
  const bengaliDigits = "০১২৩৪৫৬৭৮৯";

  return value
    .toString()
    .split("")
    .map((digit) => bengaliDigits[Number(digit)] ?? digit)
    .join("");
}