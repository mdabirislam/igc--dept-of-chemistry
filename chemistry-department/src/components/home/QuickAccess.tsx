import {
  Bell,
  CalendarDays,
  BookOpen,
  Layers3,
  FileQuestion,
  FolderOpen,
  FlaskConical,
  ClipboardCheck,
} from "lucide-react";

const quickLinks = [
  {
    title: "নোটিশ বোর্ড",
    subtitle: "সর্বশেষ বিজ্ঞপ্তি",
    href: "/notices",
    icon: Bell,
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    title: "ক্লাস রুটিন",
    subtitle: "বর্তমান সময়সূচি",
    href: "/academics/routine",
    icon: CalendarDays,
    iconClass: "bg-purple-50 text-purple-700",
  },
  {
    title: "পাঠ্যসূচি",
    subtitle: "বিভাগীয় সিলেবাস",
    href: "/academics/syllabus",
    icon: BookOpen,
    iconClass: "bg-red-50 text-red-700",
  },
  {
    title: "কোর্সসমূহ",
    subtitle: "একাডেমিক কোর্স",
    href: "/academics/courses",
    icon: Layers3,
    iconClass: "bg-orange-50 text-orange-600",
  },
  {
    title: "প্রশ্ন ব্যাংক",
    subtitle: "পুরাতন প্রশ্নপত্র",
    href: "/resources/question-papers",
    icon: FileQuestion,
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    title: "নোট ও উপকরণ",
    subtitle: "পাঠ্য সহায়ক রিসোর্স",
    href: "/resources",
    icon: FolderOpen,
    iconClass: "bg-orange-50 text-orange-600",
  },
  {
    title: "ল্যাবরেটরি",
    subtitle: "ল্যাব সম্পর্কিত তথ্য",
    href: "/laboratory",
    icon: FlaskConical,
    iconClass: "bg-purple-50 text-purple-700",
  },
  {
    title: "পরীক্ষা ও রেজাল্ট",
    subtitle: "পরীক্ষা ও ফলাফল",
    href: "/academics/examination",
    icon: ClipboardCheck,
    iconClass: "bg-green-50 text-green-700",
  },
];

export default function QuickAccess() {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto max-w-[1500px] px-4 lg:px-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-[#1b5e20]" />
          <h2 className="text-lg font-bold text-gray-800">
            দ্রুত ব্যবহারযোগ্য লিংক
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                className="group flex min-h-[78px] items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
                >
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-[14px] font-bold text-gray-800 group-hover:text-[#1a3a5c]">
                    {item.title}
                  </h3>

                  <p className="mt-0.5 truncate text-[11px] text-gray-500">
                    {item.subtitle}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}