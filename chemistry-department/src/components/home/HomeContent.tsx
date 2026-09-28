import NoticeSection from "@/components/home/NoticeSection";
import EventsSection from "@/components/home/EventsSection";
import DepartmentSummary from "@/components/home/DepartmentSummary";
import FacultyPreview from "@/components/home/FacultyPreview";
import ImportantResources from "@/components/home/ImportantResources";
import HeadMessage from "@/components/home/HeadMessage";
import GalleryPreview from "@/components/home/GalleryPreview";

export default function HomeContent() {
  return (
    <main className="bg-[#f7f9fb]">
      {/* Message from Department Head */}
      <HeadMessage />

      {/* Notice + Events + Resources */}
      <section className="pb-4">
        <div className="mx-auto w-full max-w-screen">
          <div className="grid gap-4 lg:grid-cols-[2.2fr_0.8fr] lg:items-stretch">

            {/* Notice */}
            <div className="min-w-0 lg:min-h-[580px]">
              <NoticeSection />
            </div>

            {/* Events + Resources */}
            <div className="flex min-w-0 flex-col gap-4 lg:min-h-[580px]">

              {/* Events - takes remaining height */}
              <div className="min-h-0 flex-1">
                <EventsSection />
              </div>

              {/* Resources - only takes required height */}
              <div className="shrink-0">
                <ImportantResources />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Faculty - full width */}
      <section className="pb-5">
        <div className="w-full max-w-screen">
          <FacultyPreview />
        </div>
      </section>

      {/* Gallery */}
      <GalleryPreview />

      {/* Department Summary */}
      <section className="pb-5">
        <div className="mx-auto w-full max-w-screen">
          <DepartmentSummary />
        </div>
      </section>
    </main>
  );
}