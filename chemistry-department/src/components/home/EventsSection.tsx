import { CalendarDays, MapPin, ChevronRight } from "lucide-react";

const events = [
  {
    day: "০৫",
    month: "জুন",
    title: "অনার্স ২য় বর্ষ প্র্যাকটিক্যাল পরীক্ষা শুরু",
    location: "রসায়ন বিভাগ ল্যাব",
  },
  {
    day: "১২",
    month: "জুন",
    title: "অনার্স ৩য় বর্ষ তত্ত্বীয় পরীক্ষা শুরু",
    location: "নির্ধারিত পরীক্ষার কেন্দ্র",
  },
  {
    day: "২০",
    month: "জুন",
    title: "সেমিনার: গবেষণায় রসায়নের ভূমিকা",
    location: "রসায়ন বিভাগ সেমিনার কক্ষ",
  },
  {
    day: "৩০",
    month: "জুন",
    title: "অনার্স ১ম বর্ষ ক্লাস টেস্ট",
    location: "নির্ধারিত ক্লাসরুম",
  },
];

export default function EventsSection() {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <CalendarDays size={19} className="text-[#1b5e20]" />
          আসন্ন একাডেমিক ইভেন্ট
        </h2>

        <a
          href="/activities"
          className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
        >
          সব ইভেন্ট দেখুন
          <ChevronRight size={15} />
        </a>
      </div>

      <div>
        {events.map((event, index) => (
          <a
            key={`${event.day}-${event.title}`}
            href="/activities"
            className={`flex items-start gap-3 py-2.5 transition hover:bg-gray-50 ${
              index !== events.length - 1
                ? "border-b border-gray-50"
                : ""
            }`}
          >
            <div className="w-12 shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-1 text-center">
              <span className="block text-base font-bold leading-tight text-gray-800">
                {event.day}
              </span>

              <span className="block text-[11px] text-gray-500">
                {event.month}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="text-[13px] font-bold leading-5 text-gray-700 hover:text-[#1a3a5c]">
                {event.title}
              </h3>

              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                <MapPin size={12} />
                {event.location}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}