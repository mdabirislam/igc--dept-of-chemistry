import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import HeroBanner from "@/components/home/HeroBanner";
import HomeContent from "@/components/home/HomeContent";
import { SITE_URL } from "@/lib/site";

// Structured data so search engines can recognise the department.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "রসায়ন বিভাগ, ঈশ্বরদী সরকারি কলেজ",
  url: SITE_URL,
  logo: `${SITE_URL}/images/branding/igc-logo.png`,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "ঈশ্বরদী সরকারি কলেজ",
  },
};

export default function Home() {
  return (
    <PublicSiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HeroBanner />
      <HomeContent />
    </PublicSiteLayout>
  );
}
