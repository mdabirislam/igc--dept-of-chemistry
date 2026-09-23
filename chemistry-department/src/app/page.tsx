import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import HeroBanner from "@/components/home/HeroBanner";
import HomeContent from "@/components/home/HomeContent";

export default function Home() {
  return (
    <PublicSiteLayout>
      <HeroBanner />
      <HomeContent />
    </PublicSiteLayout>
  );
}
