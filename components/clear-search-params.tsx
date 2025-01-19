"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const ClearSearchParams = () => {
  const router = useRouter();

  return (
    <Button
      variant={"secondary"}
      onClick={() => {
        router.push(window.location.pathname);
      }}
    >
      Clear
    </Button>
  );
};

export default ClearSearchParams;
