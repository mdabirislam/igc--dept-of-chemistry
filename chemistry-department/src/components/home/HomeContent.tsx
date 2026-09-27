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
        <div className="mx-auto max-w-screen">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr] lg:grid-rows-2">
            {/* Notice spans both rows on the left */}
            <div className="lg:row-span-2 lg:min-h-[580px]">
              <NoticeSection />
            </div>
              
            <div className="lg:min-h-[280px]">
              <EventsSection />
            </div>
              
            <div className="lg:min-h-[280px]">
              <ImportantResources />
            </div>
          </div>
        </div>
      </section>

      {/* Faculty - full width */}
      <section className="pb-5">
        <div className="max-w-screen">
          <FacultyPreview />
        </div>
      </section>

      {/* Gallery */}
      <GalleryPreview />

      {/* Department Summary */}
      <section className="pb-5">
        <div className="mx-auto max-w-screen">
          <DepartmentSummary />
        </div>
      </section>
    </main>
  );
}