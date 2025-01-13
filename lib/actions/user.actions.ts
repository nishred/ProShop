"use server";

import { signIn, signOut } from "@/auth";
import { client } from "@/db/prisma";

import { paymentMethodSchema, signInFormSchema, signUpFormSchema } from "@/types/validators";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { shippingAddressSchema } from "@/types/validators";

import { hashSync } from "bcrypt-ts-edge";
import { ShippingAddress } from "@/types";

import { auth } from "@/auth";
import { formatError } from "../utils";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    console.log(err);

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

export async function signOutUser() {
  await signOut();

  return {
    success: true,
    message: "Signed out successfully",
  };
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    await client.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashSync(user.password, 10),
      },
    });

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    return {
      success: true,
      message: "Signed up and signed in successfully",
    };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    return {
      success: false,
      message: "Please check the form and try again",
    };
  }
}

export async function getUserById(userId: string) {
  const user = await client.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("user not found");

  return user;
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    const user = await client.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await client.user.update({
      where: {
        id: userId,
      },

      data: {
        address
      },
    });

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (err) {

    return {
      success: false,
      message: formatError(err),
    };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await client.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await client.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
