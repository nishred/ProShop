import { getAllProducts } from "@/lib/actions/product.actions";

import ProductList from "@/components/product/product-list";

import Filtering, { FilteringProps } from "@/components/filtering";
import ClearSearchParams from "@/components/clear-search-params";

import SearchPagePagination from "@/components/SeachPagePagination";

const filterData: FilteringProps[] = [
  {
    title: "Deparment",

    filter: "category",

    data: [
      {
        displayName: "Any",
        value: "all",
      },
      {
        displayName: "Men's Dress Shirts",

        value: "Men's Dress Shirts",
      },
    ],
  },
  {
    title: "Price",

    filter: "price",

    data: [
      {
        displayName: "Any",
        value: "all",
      },
      {
        displayName: "$1 to $50",

        value: "1-50",
      },
      {
        displayName: "$51 to $100",

        value: "51-100",
      },
      {
        displayName: "$101 to $200",

        value: "101-200",
      },
      {
        displayName: "$201 to $500",

        value: "201-500",
      },
      {
        displayName: "$501 to $1000",

        value: "501-1000",
      },
    ],
  },
  {
    title: "Customer Rating",

    filter: "rating",

    data: [
      {
        displayName: "4 starts & up",
        value: "4",
      },
      {
        displayName: "3 starts & up",
        value: "3",
      },
      {
        displayName: "2 starts & up",
        value: "2",
      },
      {
        displayName: "1 starts & up",
        value: "1",
      },
    ],
  },
];

const sortData: FilteringProps = {
  filter: "sort",

  data: [
    {
      displayName: "newest",

      value: "newest",
    },
    {
      displayName: "highest",
      value: "highest",
    },
    {
      displayName: "lowest",
      value: "lowest",
    },
    {
      displayName: "rating",
      value: "rating",
    },
  ],
  flow: "horizontal",
};

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    price?: string;
    category?: string;
    rating?: string;
    page?: string;
  }>;
}) => {
  const { query, sort, price, category, rating, page } = await searchParams;

  const { data, totalPages } = await getAllProducts({
    query: query || "",
    page: Number(page || "1"),
    sort,
    price,
    category,
    rating,
  });

  return (
    <div className="grid grid-cols-4">
      <div className="col-start-1 col-end-2">
        {filterData.map((filterItem) => {
          return <Filtering key={filterItem.title} {...filterItem} />;
        })}
      </div>
      <div className="col-start-2 col-end-5">
        <div className="flex justify-end items-center">
          <ClearSearchParams />
          <Filtering {...sortData} />
        </div>

        <ProductList data={data} limit={6} title={"products"} />

        <SearchPagePagination totalPages={String(totalPages)} size={"4"} />
      </div>
    </div>
  );
};

export default SearchPage;
