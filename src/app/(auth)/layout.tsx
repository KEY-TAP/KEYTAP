import Header from "@/common/layout/Header";
import Footer from "@/common/layout/Footer";
import MainLayout from "@/common/layout/MainLayout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  );
}
