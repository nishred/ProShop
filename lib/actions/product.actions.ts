"use server";

import { client } from "@/db/prisma";

import { convertToPlainObject } from "../utils";

export async function getProducts() {
  const products = await client.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    take: 4,
  });

  return convertToPlainObject(products);
}

export async function getProductBySlug(slug: string) {
  const product = await client.product.findFirst({
    where: {
      slug,
    },
  });

  return product;
}
