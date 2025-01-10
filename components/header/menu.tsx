import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ModeToggle from "./mode-toggle";
import { Button } from "../ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, User } from "lucide-react";

const Menu = () => {
  return (
    <>
      <div className="flex gap-2 hidden md:block">
        <ModeToggle />

        <Button asChild variant={"ghost"}>
          <Link href={"/cart"}>
            <ShoppingCart /> Cart
          </Link>
        </Button>

        <Button asChild>
          <Link href={"/sign-in"}>
            <User /> Sign in
          </Link>
        </Button>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col">
            <SheetTitle>Menu</SheetTitle>

            <ModeToggle />

            <Button asChild variant={"ghost"}>
              <Link href={"/cart"}>
                <ShoppingCart /> Cart
              </Link>
            </Button>

            <Button asChild>
              <Link href={"/sign-in"}>
                <User /> Sign in
              </Link>
            </Button>

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Menu;
