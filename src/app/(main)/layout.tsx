import Header from "@/common/layout/Header";
import Footer from "@/common/layout/Footer";
import MainLayout from "@/common/layout/MainLayout";
import { getMainProducts } from "@/lib/api/mainProducts";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await getMainProducts();

  return (
    <>
      <Header />
      <MainLayout products={products}>{children}</MainLayout>
      <Footer />
    </>
  );
}
