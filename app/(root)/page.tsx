import { Metadata } from "next";

import ProductList from "@/components/product/product-list";

import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

import ProductCarousel from "@/components/product/product-carousel";

export const metadata: Metadata = {
  title: "ROOT",
};

const HomePage = async () => {
  const products = await getLatestProducts();

  const featured = await getFeaturedProducts();

  return (
    <>
      <ProductCarousel products={featured} />
      <ProductList data={products} title="newest-arrivals" />
    </>
  );
};

export default HomePage;
