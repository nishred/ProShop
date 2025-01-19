"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const NotFound = () => {

  const router = useRouter();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-8 shadow-md shadow-slate-500 flex flex-col items-center gap-4">

        <Image
          src={"/images/logo.svg"}
          alt="logo"
          width={48}
          height={48}
          priority
        />

        <div className="text-center">
          Couldn&apos;t find the requested page
          </div>

          <Button
            variant={"outline"}
            onClick={() => {
              router.push("/");
            }}
          >
            Back to Home
          </Button>
        
      </div>
    </div>
  );
};

export default NotFound;



