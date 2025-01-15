"use client";

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import {
  insertProductSchema,
  updateProductSchema,
  productFormSchema,
} from "@/types/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";

import { AWS_REGION, AWS_BUCKET_NAME } from "@/lib/constants";

import { generateS3UploadUrl } from "@/lib/actions/aws-upload";

import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

import { useState } from "react";
import { formatError } from "@/lib/utils";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [updateImages, setUpateImages] = useState(false);

  type TproductForm = z.infer<typeof productFormSchema>;

  const form = useForm<TproductForm>({
    resolver:
      type === "Update"
        ? zodResolver(updateProductSchema)
        : zodResolver(productFormSchema),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const onSubmit = async (values: TproductForm) => {
    try {
      if (type === "Create") {
        // On Create
        console.log("values", values);

        const files = Array.from(values.images as FileList);

        const uploadServiceResponse = await generateS3UploadUrl(files);

        const imageObjects = await Promise.all(uploadServiceResponse);

        const imageUrls: string[] = [];

        await Promise.all(
          imageObjects.map((imageObj) => {
            imageUrls.push(
              `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${imageObj.Key}`
            );

            return fetch(imageObj.signedUrl, {
              method: "PUT",
              body: imageObj.file,
              headers: {
                "Content-Type": imageObj.file.type,
              },
            });
          })
        );

        const productData = { ...values, images: imageUrls };

        const res = await createProduct(productData);

        if (res.success) {
          router.push("/admin/products");
        } else {
          toast({
            variant: "destructive",
            description: res.message,
          });
        }
      } else {


        if (updateImages) {



          const imageFiles = Array.from(values.images as FileList);

          const imageSignedUrls = await generateS3UploadUrl(imageFiles);

          const imageObjects = await Promise.all(imageSignedUrls);

          const imageUrls: string[] = [];

          await Promise.all(
            imageObjects.map((imageObj) => {
              imageUrls.push(
                `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${imageObj.Key}`
              );

              return fetch(imageObj.signedUrl, {
                method: "PUT",
                body: imageObj.file,
                headers: {
                  "Content-Type": imageObj.file.type,
                },
              });
            })
          );

          values.images = imageUrls;
        }

        const res = await updateProduct({
          ...values,
          images: values.images as string[],
          id: productId as string,
        });

        if (res.success) {
          router.push("/admin/products");
        } else {
          toast({
            variant: "destructive",
            description: res.message,
          });
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: formatError(err),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "slug"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "category"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "brand"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "price"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "stock"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* Images */}

          <FormField
            name="images"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (type === "Update") setUpateImages(true);
                      field.onChange(e.target.files);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* isFeatured */}
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "description"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
