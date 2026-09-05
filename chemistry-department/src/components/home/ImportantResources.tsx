import {
  FileText,
  Download,
  ChevronRight,
} from "lucide-react";

const resources = [
  {
    type: "PDF",
    typeClass: "bg-red-100 text-red-700",
    title: "অজৈব রসায়ন (Inorganic Chemistry) নোট",
    meta: "PDF · 2.4 MB",
  },
  {
    type: "PDF",
    typeClass: "bg-red-100 text-red-700",
    title: "জৈব রসায়ন (Organic Chemistry) গাইড",
    meta: "PDF · 1.8 MB",
  },
  {
    type: "DOC",
    typeClass: "bg-blue-100 text-blue-700",
    title: "ভৌত রসায়ন (Physical Chemistry) নোট",
    meta: "DOCX · 3.2 MB",
  },
  {
    type: "PDF",
    typeClass: "bg-red-100 text-red-700",
    title: "বিশ্লেষণী রসায়ন ল্যাব ম্যানুয়াল",
    meta: "PDF · 4.1 MB",
  },
];

export default function ImportantResources() {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <FileText size={19} className="text-[#1b5e20]" />
          গুরুত্বপূর্ণ শিক্ষাসামগ্রী
        </h2>

        <a
          href="/resources"
          className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
        >
          সব দেখুন
          <ChevronRight size={15} />
        </a>
      </div>

      <div>
        {resources.map((resource, index) => (
          <div
            key={resource.title}
            className={`flex items-center gap-3 py-2 ${
              index !== resources.length - 1
                ? "border-b border-gray-50"
                : ""
            }`}
          >
            <span
              className={`flex h-7 w-8 shrink-0 items-center justify-center rounded text-[9px] font-bold ${resource.typeClass}`}
            >
              {resource.type}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-medium text-gray-700">
                {resource.title}
              </h3>

              <p className="text-[10px] text-gray-400">
                {resource.meta}
              </p>
            </div>

            <a
              href="/resources/downloads"
              className="flex shrink-0 items-center gap-1 rounded bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 hover:bg-green-100"
            >
              <Download size={12} />
              ডাউনলোড
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}