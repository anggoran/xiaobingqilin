// fixed size on pagination

import { PageProps } from "$fresh/server.ts";

export default function Home(props: PageProps) {
  const hanziList = [
    "我",
    "是",
    "印",
    "尼",
    "人",
    "我",
    "是",
    "印",
    "尼",
    "人",
    "我",
    "是",
    "印",
    "尼",
    "人",
  ];
  const totalPages = hanziList.length;
  const currentPage = parseInt(props.url.searchParams.get("page") || "1");
  // const contentPerPage = 10;
  // const startIndex = (currentPage - 1) * contentPerPage;
  // const endIndex = startIndex + contentPerPage - 1;
  let pages = [];
  if (currentPage <= 6) {
    pages = [1, 2, 3, 4, 5, 6, "..."];
  } else if (currentPage > totalPages - 6) {
    pages = [
      "...",
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  } else {
    pages = [
      "...",
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      "...",
    ];
  }

  return (
    <div className="h-screen content-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <p className="font-bold">Page {currentPage}</p>
        <div>
          <table className="border-collapse border border-black">
            <thead>
              <tr>
                {["", "Form", "Sound", "Meaning"].map((e) => (
                  <th className="p-1 border border-gray-500">
                    {e}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "乌",
                  "wū",
                  ["abbr. for Ukraine 烏克蘭|乌克兰[Wu1ke4lan2]", "surname Wu"],
                ],
                ["乌", "wū", ["crow", "black"]],
                ["我", "wǒ", ["I; me; my"]],
              ].map((e, i) => (
                <tr>
                  <td className="px-2 py-1 border border-gray-500 text-center">
                    {i + 1}
                  </td>
                  <td className="p-1 border border-gray-500 text-center text-blue-500">
                    <a href={"/hanzi" + `/${e[0]}`}>{e[0]}</a>
                  </td>
                  <td className="p-1 border border-gray-500 text-center">
                    {e[1]}
                  </td>
                  <td className="p-1 border border-gray-500">
                    <ul>
                      {e[2].map((elem) => (
                        <li>{e[2].length > 1 ? "•" : ""} {elem}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* to be edited */}
        <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <a
              href="?page=1"
              class={`${
                currentPage == 1
                  ? "pointer-events-none stroke-gray-300"
                  : "stroke-gray-500"
              } relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
            >
              <svg
                name="first-page-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6 stroke-1 fill-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                />
              </svg>
            </a>
            <a
              href={`?page=${currentPage - 1}`}
              class={`${
                currentPage == 1
                  ? "pointer-events-none stroke-gray-300"
                  : "stroke-gray-500"
              } relative inline-flex items-center px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
            >
              <svg
                name="chevron-left-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6 stroke-1 fill-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </a>
            {pages.map((e) => (
              <a
                href={`?page=${e}`}
                class={`${
                  currentPage == e
                    ? "z-10 bg-black text-white ring-black"
                    : "bg-white text-black ring-gray-300 hover:bg-gray-50"
                } ${
                  e == "..." ? "pointer-events-none text-gray-300" : ""
                } px-4 py-2 text-sm ring-1 ring-inset`}
              >
                {e}
              </a>
            ))}
            <a
              href={`?page=${currentPage + 1}`}
              class={`${
                currentPage == totalPages
                  ? "pointer-events-none stroke-gray-300"
                  : "stroke-gray-500"
              } relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
            >
              <svg
                name="chevron-right-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6 stroke-1 fill-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </a>
            <a
              href={`?page=${totalPages}`}
              class={`${
                currentPage == totalPages
                  ? "pointer-events-none stroke-gray-300"
                  : "stroke-gray-500"
              } relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
            >
              <svg
                name="last-page-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6 stroke-1 fill-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
