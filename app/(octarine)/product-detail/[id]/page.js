import { getProductId } from "@/service/queries";
import ProductDetail from "./components/ProductDetail";
import DescriptionAccrdion from "./components/DescriptionAccordion";
import ProductRecommendation from "./components/Recommendation";

export default async function OctarineShopPage({ params }) {
  const { id } = params;

  const productId = await getProductId(id);

  return (
    <>
      <ProductDetail product={productId} />
      <DescriptionAccrdion description={productId.description} />
      <ProductRecommendation />
    </>
  );
}
