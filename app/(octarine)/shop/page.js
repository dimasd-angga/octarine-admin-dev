import { fetchFromAPI } from "@/service/api";
import Products from "./components/Products";

export default async function OctarineShopPage({ searchParams }) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const size = searchParams?.size ? parseInt(searchParams.size, 10) : 10;
  const brands = searchParams?.brands ? searchParams.brands.split(",") : [];
  const gender = searchParams?.gender ? searchParams.gender.split(",") : [];
  const banner = searchParams?.banner ? searchParams.banner.split(",") : [];
  const product = searchParams?.product ? searchParams.product.split(",") : [];
  const onSale = searchParams?.onSale === "true";

  const query = {
    pageNumber: page,
    pageSize: size,
  };

  // for filter product
  if (brands.length > 0) query.brands = brands;
  if (gender.length > 0) query.genderPreferences = gender;
  if (banner.length > 0) query.bannerTypes = banner;
  if (product.length > 0) query.productTypes = product;
  if (onSale) query.onSale = "true";

  // fetching data
  const productsData = await fetchFromAPI({
    endpoint: "/public/products",
    query,
    options: { method: "GET" },
  });

  // Fetch enum data using fetchFromAPI
  const getEnumData = async (endpoint) => {
    return await fetchFromAPI({
      endpoint: endpoint,
    });
  };

  const [genderPreferences, bannerTypes, productTypes] = await Promise.all([
    getEnumData("/enums/gender-preferences"),
    getEnumData("/enums/banner-type"),
    getEnumData("/enums/product-types"),
  ]);

  return (
    <>
      <Products
        initialProducts={
          Array.isArray(productsData.products.content)
            ? productsData.products.content
            : []
        }
        currentPage={productsData.products.page?.number + 1 || page}
        totalPages={productsData.products.page?.totalPages || 1}
        totalElements={productsData.products.page?.totalElements || 0}
        menPerfumeCount={productsData.menPerfumeCount || 0}
        womenPerfumeCount={productsData.womenPerfumeCount || 0}
        unisexPerfumeCount={productsData.unisexPerfumeCount || 0}
        genderPreferences={genderPreferences}
        bannerTypes={bannerTypes}
        productTypes={productTypes}
      />
    </>
  );
}
