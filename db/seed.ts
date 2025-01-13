import { client } from "./prisma";

import sampleData from "./sample-data";

async function addProducts() {

  
  await client.product.deleteMany();
  await client.account.deleteMany();
  await client.session.deleteMany();
  await client.verificationToken.deleteMany();

  const products = await client.product.createMany({
    data: sampleData.products,
  });

  const users = await client.user.createMany({
    data: sampleData.users,
  });

  console.log("Db has been seeeded with products");
}

addProducts();
