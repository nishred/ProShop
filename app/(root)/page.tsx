import { Metadata } from "next";

import ProductList from "@/components/product/product-list";

import { getProducts } from "@/lib/actions/product.actions";

export const metadata: Metadata = {
  title: "ROOT",
};

const HomePage = async () => {

  const products = await getProducts();

  return (
    <>
      <ProductList data={products} title="newest-arrivals" />
    </>
  );
};

export default HomePage;


