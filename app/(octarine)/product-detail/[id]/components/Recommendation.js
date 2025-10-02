import GridView from "@/app/(octarine)/shop/components/GridView";
import { getProducts } from "@/service/queries";

export default async function ProductRecommendation() {
  const products = await getProducts({ page: 1 });

  return (
    <section className="container">
      <div className="heading-section text-center">
        <h3 className="heading">You may also like this product</h3>
      </div>
      <div className={`tf-grid-layout wrapper-shop tf-col-4`}>
        <GridView products={products["products"]} />
      </div>
    </section>
  );
}
