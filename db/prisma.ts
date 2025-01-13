import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const client = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },

        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { itemsPrice: true },

        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      taxPrice: {
        needs: { itemsPrice: true },

        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      totalPrice: {
        needs: { itemsPrice: true },

        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },

        compute(order) {
          return order.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { itemsPrice: true },

        compute(order) {
          return order.itemsPrice.toString();
        },
      },
      taxPrice: {
        needs: { itemsPrice: true },

        compute(order) {
          return order.itemsPrice.toString();
        },
      },
      totalPrice: {
        needs: { itemsPrice: true },

        compute(order) {
          return order.itemsPrice.toString();
        },
      },
    },
    orderItem: {
      compute(orderItem) {
        return orderItem.price.toString();
      },
    },
  },
});

//price and rating are stored as decimals in the db. but when  we fetch from prisma we want them to be strings
