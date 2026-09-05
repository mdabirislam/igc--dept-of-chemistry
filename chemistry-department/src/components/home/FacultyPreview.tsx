import { Users, ChevronRight } from "lucide-react";

const faculty = [
  {
    name: "অধ্যাপক —",
    designation: "বিভাগীয় প্রধান",
    image: "/images/faculty/faculty-01.jpg",
  },
  {
    name: "সহযোগী অধ্যাপক —",
    designation: "সহযোগী অধ্যাপক",
    image: "/images/faculty/faculty-02.jpg",
  },
  {
    name: "সহকারী অধ্যাপক —",
    designation: "সহকারী অধ্যাপক",
    image: "/images/faculty/faculty-03.jpg",
  },
  {
    name: "প্রভাষক —",
    designation: "প্রভাষক",
    image: "/images/faculty/faculty-04.jpg",
  },
  {
    name: "প্রভাষক —",
    designation: "প্রভাষক",
    image: "/images/faculty/faculty-05.jpg",
  },
];

export default function FacultyPreview() {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <Users size={19} className="text-[#1b5e20]" />
          শিক্ষকবৃন্দ
        </h2>

        <a
          href="/faculty"
          className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
        >
          সব শিক্ষক দেখুন
          <ChevronRight size={15} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {faculty.map((person) => (
          <a
            href="/faculty"
            key={person.name}
            className="group overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-2 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            <div className="relative aspect-[4/4.5] overflow-hidden rounded bg-gray-100">
              <img
                src={person.image}
                alt={person.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 -z-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Users
                  size={42}
                  strokeWidth={1.2}
                  className="text-gray-300"
                />
              </div>
            </div>

            <div className="px-1 pb-1 pt-2 text-center">
              <h3 className="truncate text-xs font-bold text-gray-800">
                {person.name}
              </h3>

              <p className="mt-0.5 truncate text-[10px] text-gray-500">
                {person.designation}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}