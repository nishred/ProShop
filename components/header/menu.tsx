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
import UserButton from "./user-button";

const Menu = () => {
  return (
    <>
      <div className="gap-2 hidden md:flex">
        <ModeToggle />

        <Button asChild variant={"ghost"}>
          <Link href={"/cart"}>
            <ShoppingCart /> Cart
          </Link>
        </Button>

        <UserButton />
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

            <UserButton />

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Menu;

