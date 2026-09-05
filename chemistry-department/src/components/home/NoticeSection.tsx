import {
  Bell,
  CalendarDays,
  ChevronRight,
  Download,
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
    title: "অনার্স ১ম বর্ষ (২০২৫-২০২৬) শিক্ষার্থীদের ওরিয়েন্টেশন বিষয়ে বিজ্ঞপ্তি",
    category: "গুরুত্বপূর্ণ",
    publishedAt: "০১/০৯/২০২৬",
    pdfUrl: "/documents/notices/notice-01.pdf",
  },
  {
    id: 2,
    title: "অনার্স ১ম বর্ষ পরীক্ষার বিষয়ে শিক্ষার্থীদের জন্য গুরুত্বপূর্ণ বিজ্ঞপ্তি",
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
    <section className="rounded-lg border border-gray-100 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <Bell size={19} className="text-[#1b5e20]" />
          সর্বশেষ নোটিশ
        </h2>

        <a
          href="/notices"
          className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
        >
          সব নোটিশ দেখুন
          <ChevronRight size={15} />
        </a>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 px-4 py-3">
        <button
          type="button"
          className="rounded-full border border-[#006a35] bg-[#006a35] px-4 py-1.5 text-sm font-medium text-white"
        >
          সব
        </button>

        <button
          type="button"
          className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition hover:border-[#006a35] hover:text-[#006a35]"
        >
          গুরুত্বপূর্ণ
        </button>

        <button
          type="button"
          className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition hover:border-[#006a35] hover:text-[#006a35]"
        >
          বিজ্ঞপ্তি
        </button>

        <button
          type="button"
          className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition hover:border-[#006a35] hover:text-[#006a35]"
        >
          নোটিশ
        </button>

        <button
          type="button"
          className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition hover:border-[#006a35] hover:text-[#006a35]"
        >
          সেমিনার
        </button>
      </div>

      {/* Notice Table */}
      <div className="px-4 pb-4">
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full min-w-[350px] border-collapse text-sm">

            <thead>
              <tr className="bg-gray-50 text-left text-gray-800">
                <th className="w-[70px] border-b border-r border-gray-200 px-3 py-3 font-bold">
                  ক্রমিক
                  <br />
                  নং
                </th>

                <th className="border-b border-r border-gray-200 px-3 py-3 font-bold">
                  শিরোনাম
                </th>

                <th className="w-[125px] border-b border-r border-gray-200 px-3 py-3 font-bold">
                  তারিখ
                </th>

                <th className="w-[105px] border-b border-gray-200 px-3 py-3 text-center font-bold">
                  ডাউনলোড
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
                  <td className="border-b border-r border-gray-200 px-3 py-3 align-top text-gray-700">
                    {toBengaliNumber(index + 1)}
                  </td>

                  {/* Title */}
                  <td className="border-b border-r border-gray-200 px-3 py-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex shrink-0 rounded border px-2 py-0.5 text-[11px] font-medium ${
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
                        className="leading-6 text-gray-800 transition group-hover:text-green-700 hover:underline"
                      >
                        {notice.title}
                      </a>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="border-b border-r border-gray-200 px-3 py-3 align-top whitespace-nowrap text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays
                        size={14}
                        className="text-gray-400"
                      />
                      {notice.publishedAt}
                    </span>
                  </td>

                  {/* Download */}
                  <td className="border-b border-gray-200 px-3 py-3 text-center align-top">
                    <a
                      href={notice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      aria-label={`${notice.title} PDF download`}
                      className="inline-flex items-center justify-center rounded-md p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <FileText size={28} strokeWidth={1.6} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* More Button */}
        <div className="pt-4">
          <a
            href="/notices"
            className="inline-flex items-center gap-2 rounded-md bg-[#007a3d] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#006632]"
          >
            আরও দেখুন
            <ChevronRight size={16} />
          </a>
        </div>
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