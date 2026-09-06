import QuickAccess from "@/components/home/QuickAccess";
import NoticeSection from "@/components/home/NoticeSection";
import EventsSection from "@/components/home/EventsSection";
import DepartmentSummary from "@/components/home/DepartmentSummary";
import FacultyPreview from "@/components/home/FacultyPreview";
import ImportantResources from "@/components/home/ImportantResources";

export default function HomeContent() {
  return (
    <main className="bg-[#f7f9fb]">
      {/* Quick Access */}
      <QuickAccess />

      {/* Notice + Events */}
      <section className="pb-4">
        <div className="mx-auto max-w-[1500px] px-4 lg:px-6">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <NoticeSection />
            <EventsSection />
          </div>

          {/* Department Summary */}
          <div className="mt-4">
            <DepartmentSummary />
          </div>
        </div>
      </section>

      {/* Faculty + Resources */}
      <section className="pb-5">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 lg:grid-cols-[2fr_1fr] lg:px-6">
          <FacultyPreview />
          <ImportantResources />
        </div>
      </section>
    </main>
  );
}