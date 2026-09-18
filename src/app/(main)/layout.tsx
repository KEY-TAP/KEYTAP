import Header from "@/common/layout/Header";
import Footer from "@/common/layout/Footer";
import MainLayout from "@/common/layout/MainLayout";
import { getMainProducts, getLikedProductIds } from "@/lib/api/mainProducts";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, likedProductIds] = await Promise.all([
    getMainProducts(),
    getLikedProductIds(),
  ]);

  return (
    <>
      <Header />
      <MainLayout products={products} likedProductIds={likedProductIds}>
        {children}
      </MainLayout>
      <Footer />
    </>
  );
}
