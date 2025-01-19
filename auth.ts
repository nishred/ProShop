import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { client as prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig, Session } from "next-auth";
import { cookies } from "next/headers";
import type { JWT, Account, Profile } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { compareSync } from "bcrypt-ts-edge";

import { User } from "next-auth";


export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  secret : process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (credentials == null) return null;

        console.log(credentials);

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        console.log("user", user);

        // Check if user exists and if the password matches
        if (user && user.password) {

         const isMatch = compareSync(credentials.password as string,user.password)

          console.log("password match", isMatch);

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],

  callbacks: {
    // A session in next auth is simply a higher level abstraction of the user's auth state. It is an object that contains the user's information and is passed around the app to determine the user's auth state. It is derived from the JWT token that is passed around the app.

    // The session callback is where the jwt is used to shape the session object. The session object is then passed around the app to determine the user's auth state.

    // Every time a session is requested, this callback is called. The session can be derived from the JWT token or from the user object.

    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },

    async jwt({ token, user, trigger, session }:{

    token: JWT;
    user: User;
    account: Account | null;
    profile?: Profile;
    trigger?: "signIn" | "signUp" | "update";
    isNewUser?: boolean;
    session?: any;

    }) {
      // Assign user fields to token
      if (user) {


        token.id = user.id;
        token.role = user.role || "";

        // If user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();

          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },

    // A cookie is some data that is stored in the user's device by the  browser. It is sent to the server with every request the user makes. It is sent as part of the cookie header.

    // the authorized callback gets called for every request that you make inside your application. It is used to determine if the user is authorized to access a certain path. If the user is not authorized, the callback returns false and the user is redirected to the sign-in page.

    // everytime you go on to the website, a sessioncartId is generated and put in a cookie

    // If you dont create the middleware, the authorized callback wont get called.This is where the control goes when you hit the middleware.

    // This is where the control goes when you hit the middleware

    authorized({ request, auth }: any) {
      // the auth object here is the session

      // Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
