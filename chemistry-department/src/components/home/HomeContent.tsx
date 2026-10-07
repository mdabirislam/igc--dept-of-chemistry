import NoticeSection from "@/components/home/NoticeSection";
import EventsSection from "@/components/home/EventsSection";
import DepartmentSummary from "@/components/home/DepartmentSummary";
import FacultyPreview from "@/components/home/FacultyPreview";
import ImportantResources from "@/components/home/ImportantResources";
import HeadMessage from "@/components/home/HeadMessage";
import GalleryPreview from "@/components/home/GalleryPreview";
import "@/components/home/home-content.css";

export default function HomeContent() {
  return (
    // <main className="bg-[url('/images/background/bg-2.jpg')] bg-cover bg-center bg-no-repeat">
    <main className="bg-grad">

      {/* Message from Department Head */}
      <HeadMessage />

      {/* Notice + Events + Resources */}
      <section className="pb-4 lg:h-[82vh] lg:min-h-[500px] lg:max-h-[800px] lg:overflow-hidden">
        <div className="mx-auto w-full max-w-screen grid gap-4 lg:grid-cols-3 lg:h-full lg:overflow-hidden">
            {/* Notice */}
              <NoticeSection />

            {/* Events + Resources */}
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:h-full lg:overflow-hidden lg:grid-rows-[5fr_3fr] lg:px-2">

              {/* Events - takes remaining height */}
                <EventsSection />

              {/* Resources - only takes required height */}
                <ImportantResources />
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
      <section>
        <div className="mx-auto w-full max-w-screen">
          <DepartmentSummary />
        </div>
      </section>
    </main>
  );
}
