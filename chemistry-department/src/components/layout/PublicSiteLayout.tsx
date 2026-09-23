import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import DepartmentBar from "@/components/layout/DepartmentBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PublicSiteLayoutProps {
  children: React.ReactNode;
}

export default function PublicSiteLayout({
  children,
}: PublicSiteLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopBar />
      <Header />
      <DepartmentBar />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
