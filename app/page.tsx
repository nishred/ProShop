"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const HomePage = () => {
  const formSchema = z
    .object({
      fullName: z.string().nonempty("Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),

      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .refine(
      (data) => {
        return data.password === data.confirmPassword;
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  type Tform = z.infer<typeof formSchema>;

  const form = useForm<Tform>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<Tform> = async (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage>
                  {errors?.fullName && errors.fullName.message}
                </FormMessage>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>{errors?.email && errors.email.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>
                {errors?.password && errors.password.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="confirm password" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>
                {errors?.confirmPassword && errors.confirmPassword.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default HomePage;
