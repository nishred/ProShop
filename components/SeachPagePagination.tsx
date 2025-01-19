"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function createArray(start: number, end: number): number[] {
  const arr: number[] = [];

  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
}

const Page = ({
  number,
  selected,
  onClick,
}: {
  number: string;
  selected?: boolean;
  onClick: () => void;
}) => {
  return (
    <li onClick={onClick}>
      <a
        href="#"
        className={cn(
          !selected &&
            "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",

          selected &&
            "flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        )}
      >
        {number}
      </a>
    </li>
  );
};

const Previous = ({ onClick }: { onClick: () => void }) => {
  return (
    <li onClick={onClick}>
      <a
        href="#"
        className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Previous
      </a>
    </li>
  );
};

const Next = ({ onClick }: { onClick: () => void }) => {
  return (
    <li onClick={onClick}>
      <a
        href="#"
        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Next
      </a>
    </li>
  );
};

const SearchPagePagination = ({
  totalPages,
  size,
}: {
  totalPages: string;
  size: string;
}) => {
  const [current, setCurrent] = useState("1");

  const router = useRouter();

  const [start, setStart] = useState("1");

  const [end, setEnd] = useState(
    String(Math.max(Number(size), Number(totalPages)))
  );

  useEffect(() => {
    if (Number(current) >= Number(start) && Number(current) <= Number(end))
      return;

    if (Number(current) > Number(end)) {
      const nextStart = Number(end) + 1;

      const nextEnd = Math.max(
        Number(totalPages),
        nextStart + Number(size) - 1
      );

      setStart(String(nextStart));

      setEnd(String(nextEnd));
    } else {
      const nextStart = Number(start) - Number(size);

      setStart(String(nextStart));

      setEnd(current);
    }
  }, [current]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", current);

    router.push(`?${params.toString()}`);
  }, [current]);

  return (
    <div className="mx-auto">
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10">
          {start !== "1" && (
            <Previous
              onClick={() => {
                setCurrent(String(Number(current) - 1));
              }}
            />
          )}

          {createArray(Number(start), Number(end)).map((index) => {
            return (
              <Page
                onClick={() => {
                  setCurrent(String(index));
                }}
                key={index}
                number={String(index)}
                selected={Number(current) === index}
              />
            );
          })}

          {end !== totalPages && (
            <Next
              onClick={() => {
                setCurrent(String(Number(current) + 1));
              }}
            />
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SearchPagePagination;
