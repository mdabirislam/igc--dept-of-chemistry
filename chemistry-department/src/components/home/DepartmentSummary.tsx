import {
  Users,
  GraduationCap,
  BookOpen,
  FlaskConical,
} from "lucide-react";

const statistics = [
  {
    title: "শিক্ষকবৃন্দ",
    value: "১৫",
    suffix: " জন",
    icon: Users,
    className: "bg-green-50 text-green-700",
  },
  {
    title: "পাঠক্রম",
    value: "০৮",
    suffix: " টি",
    icon: GraduationCap,
    className: "bg-blue-50 text-blue-700",
  },
  {
    title: "ল্যাবরেটরি",
    value: "০৩",
    suffix: " টি",
    icon: BookOpen,
    className: "bg-green-50 text-green-700",
  },
  {
    title: "কোর্স",
    value: "৮০+",
    suffix: " টি",
    icon: FlaskConical,
    className: "bg-red-50 text-red-700",
  },
];

export default function DepartmentSummary() {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 border-b border-gray-100 pb-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 sm:text-lg">
          <BookOpen
            size={18}
            className="text-[#1b5e20] sm:h-[19px] sm:w-[19px]"
          />
          বিভাগের সারসংক্ষেপ
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`flex min-h-[76px] items-center gap-2.5 rounded-lg px-3 sm:min-h-[84px] sm:gap-3 sm:px-4 ${item.className}`}
            >
              <Icon
                size={25}
                strokeWidth={1.8}
                className="shrink-0 sm:h-7 sm:w-7"
              />

              <div className="min-w-0">
                <p className="text-[11px] text-gray-600 sm:text-xs">
                  {item.title}
                </p>

                <p className="mt-0.5 text-xl font-bold leading-none text-gray-900 sm:text-2xl">
                  {item.value}

                  <span className="ml-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                    {item.suffix}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}