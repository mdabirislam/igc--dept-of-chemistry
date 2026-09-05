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
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 border-b border-gray-100 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <BookOpen size={19} className="text-[#1b5e20]" />
          বিভাগের সারসংক্ষেপ
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`flex min-h-[84px] items-center gap-3 rounded-lg px-4 ${item.className}`}
            >
              <Icon size={28} strokeWidth={1.8} />

              <div>
                <p className="text-xs text-gray-600">{item.title}</p>

                <p className="mt-0.5 text-2xl font-bold leading-none text-gray-900">
                  {item.value}
                  <span className="ml-1 text-xs font-medium text-gray-600">
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