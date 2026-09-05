import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import DepartmentBar from "@/components/layout/DepartmentBar";
import Navbar from "@/components/layout/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import HomeContent from "@/components/home/HomeContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopBar />

      <Header />

      <DepartmentBar />

      <Navbar />

      <HeroBanner />

      <HomeContent />

    </div>
  );
}