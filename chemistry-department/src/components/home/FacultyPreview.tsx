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
  const head = faculty[0];
  const otherFaculty = faculty.slice(1);

  return (
    <section className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 sm:text-lg">
          <Users size={19} className="text-[#1b5e20]" />
          শিক্ষকবৃন্দ
        </h2>

        <a
          href="/faculty"
          className="flex items-center gap-1 text-xs font-medium text-green-700 hover:underline sm:text-sm"
        >
          সব শিক্ষক দেখুন
          <ChevronRight size={15} />
        </a>
      </div>

      {/* Department Head */}
      <div className="mb-4 flex flex-col items-center rounded-lg border border-green-100 bg-green-50/40 px-4 py-4 text-center sm:mb-5 sm:px-6 sm:py-5">
        <div className="h-[130px] w-[105px] overflow-hidden rounded-lg border-2 border-white bg-gray-100 shadow-sm sm:h-[145px] sm:w-[118px]">
          <img
            src={head.image}
            alt={head.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-bold text-gray-800 sm:text-base">
            {head.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-green-700 sm:text-sm">
            {head.designation}
          </p>
        </div>
      </div>

      {/* Other Faculty */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {otherFaculty.map((person) => (
          <a
            href="/faculty"
            key={person.image}
            className="group flex min-h-[125px] items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:bg-white hover:shadow-sm sm:min-h-[145px] sm:p-4"
          >
            <div className="h-[105px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-[120px] sm:w-[96px]">
              <img
                src={person.image}
                alt={person.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-sm font-bold leading-snug text-gray-800 sm:text-base">
                {person.name}
              </h3>

              <p className="mt-1 break-words text-xs leading-relaxed text-gray-500 sm:text-sm">
                {person.designation}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}