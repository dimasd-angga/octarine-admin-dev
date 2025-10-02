import MarqueeSection from "@/components/common/MarqueeSection";
import Tiktok from "@/components/common/Tiktok";
import BestSeller from "@/components/homes/BestSeller";
import DiscoverYourScent from "@/components/homes/DiscoverYourScent";
import { getBanners, getbestSeller, getCollections } from "@/service/queries";
import OctarineHeroBanner from "./(octarine)/homes/Banner";
import OctarineHomeCollections from "./(octarine)/homes/Collections";
import HomeBanner from "@/components/homes/banner";
export const metadata = {
  title:
    "Home Fashion Main || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default async function HomeFashionMainPage() {
  const [banners, bestSellers, collections] = await Promise.all([
    getBanners(),
    getbestSeller(),
    getCollections(),
  ]);


  return (
    <>
      <OctarineHeroBanner data={banners} />
      <OctarineHomeCollections collections={collections} />
      <HomeBanner />
      <BestSeller products={bestSellers} />
      <div style={{ marginBlock: '80px' }}>
        <MarqueeSection />
      </div>
      {/* <Products />
      <Products2 /> */}
      {/* <Collections2 /> */}
      <DiscoverYourScent />
      <div style={{ marginTop: '66px' }}>
        <Tiktok />
      </div>
    </>
  );
}
