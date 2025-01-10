import { ShoppingBag, ShoppingCart, User } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

import { Button } from "../ui/button";
import ModeToggle from "./mode-toggle";

import Menu from "./menu";

const Header = () => {
  return (
    <div className="border-b border-solid border-slate-300">
      <div className="py-3 wrapper flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Link href="/">
            <Image
              src={"/images/logo.svg"}
              alt="proshop-logo"
              width={48}
              height={48}
            />
          </Link>

          <h1 className="text-3xl font-semibold text-slate-700 hidden lg:block">
            Proshop
          </h1>
        </div>

        <Menu />
      </div>
    </div>
  );
};

export default Header;
