import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Product } from "@/types";

import Image from "next/image";

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {products.map((product) => {
            return (
              <CarouselItem key={product.id} className="border border-solid border-purple-700 flex justify-center items-center">
                <Image
                  alt="product"
                  width={400}
                  height={400}
                  src={product.images[0]}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious />

        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
