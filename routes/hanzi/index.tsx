import { Handlers, PageProps } from "$fresh/server.ts";
import { getHanziList } from "../../controllers/hanzi.ts";
import { HanziModel } from "../../models/hanzi.ts";
import { paginate } from "../../utils/paginate.ts";

interface Data {
  totalPages: number;
  hanziList: HanziModel[];
}

export const handler: Handlers<Data> = {
  GET: (req, ctx) => getHanziList(req, ctx),
};

export default function HanziPage(props: PageProps<Data>) {
  const currentPage = parseInt(props.url.searchParams.get("page") || "1");
  const { totalPages, hanziList } = props.data;
  const pagination = paginate(currentPage, totalPages);
  const contentPerPage = 10;
  const startOrder = currentPage * contentPerPage - 9;
  const endOrder = currentPage * contentPerPage;

  const pageNumbers = Array.from(
    { length: endOrder - startOrder + 1 },
    (_, i) => i + startOrder,
  );

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
              {hanziList.map((e, i) => (
                <tr>
                  <td className="px-2 py-1 border border-gray-500 text-center">
                    {pageNumbers[i]}
                  </td>
                  <td className="p-1 border border-gray-500 text-center text-blue-500">
                    <a href={"/hanzi" + `/${e.form}`}>{e.form}</a>
                  </td>
                  <td className="p-1 border border-gray-500 text-center">
                    {e.sound}
                  </td>
                  <td className="p-1 border border-gray-500">
                    <ul>
                      {e.meaning.split(";").length > 1
                        ? e.meaning.split(";").map((elem) => (
                          <li>{"• " + elem}</li>
                        ))
                        : <li>{e.meaning}</li>}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            {pagination.map((e) => (
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
