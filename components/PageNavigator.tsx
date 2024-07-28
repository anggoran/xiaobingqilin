import {
  FirstPageIcon,
  LastPageIcon,
  NextPageIcon,
  PreviousPageIcon,
} from "./Icons.tsx";

interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  pagination: (number | string)[];
}

const styledIconBox = (isActive: boolean) => {
  const activated = isActive
    ? "stroke-gray-500"
    : "pointer-events-none stroke-gray-300";
  return [
    "inline-flex items-center p-2 ring-1 ring-gray-300 ring-inset hover:bg-gray-50",
    activated,
  ].join(" ");
};

export default function PageNavigator(
  { props }: { props: PageNavigatorProps },
) {
  const { currentPage, totalPages, pagination } = props;

  return (
    <nav class="inline-flex -space-x-px">
      <a
        href={`?page=${1}`}
        class={styledIconBox(currentPage != 1) + " " + "rounded-l-md"}
      >
        <FirstPageIcon />
      </a>
      <a
        href={`?page=${currentPage - 1}`}
        class={styledIconBox(currentPage != 1)}
      >
        <PreviousPageIcon />
      </a>
      {pagination.map((page) => (
        <a
          href={`?page=${page}`}
          class={`${
            currentPage == page
              ? "z-10 bg-black text-white ring-black"
              : "bg-white text-black ring-gray-300 hover:bg-gray-50"
          } ${
            page == "..." ? "pointer-events-none text-gray-300" : undefined
          } px-4 py-2 ring-1 ring-inset`}
        >
          {page}
        </a>
      ))}
      <a
        href={`?page=${currentPage + 1}`}
        class={styledIconBox(currentPage != totalPages)}
      >
        <NextPageIcon />
      </a>
      <a
        href={`?page=${totalPages}`}
        class={styledIconBox(currentPage != totalPages) + " " + "rounded-r-md"}
      >
        <LastPageIcon />
      </a>
    </nav>
  );
}
