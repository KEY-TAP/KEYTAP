import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainLayout from "@/components/layout/MainLayout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  );
}
