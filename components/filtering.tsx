"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type FilteringProps = {
  title?: string;
  filter: string;
  flow?: string;
  data: {
    displayName: string;
    value: string;
  }[];
};

const Filtering = ({
  filter,
  title,
  data,
  flow = "vertical",
}: FilteringProps) => {
  const [state, setState] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (state === "") return;

    const params = new URLSearchParams(window.location.search);

    params.set(filter, state);

    router.push(`?${params.toString()}`);
  }, [state]);

  return (
    <div className="my-8">
      <h1 className="text-xl font-semibold">{title}</h1>

      <ul className={cn("flex flex-col items-start",flow === "horizontal" && "flex-row items-center gap-2")}>
        {data.map((item) => {
          return (
            <li
              key={item.displayName}
              className={cn("px-4 rounded-md py-2", state === item.value && "bg-slate-200")}
            >
              <button
                className="cursor-pointer hover:scale-105"
                onClick={() => {
                  setState(item.value);
                }}
              >
                {item.displayName}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Filtering;
