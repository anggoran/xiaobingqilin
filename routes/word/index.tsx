import { PageProps } from "$fresh/server.ts";
import InfiniteWords from "../../islands/InfiniteWords.tsx";

export default function WordPage(props: PageProps) {
  const keyword = props.url.searchParams.get("keyword") ?? "";
  return (
    <>
      <a href="/">Back to home</a>
      <div className="h-auto content-center bg-white">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Word Database</h1>
          <form className="flex space-x-2 mb-4">
            <input
              type="text"
              name="keyword"
              value={keyword}
              placeholder="Search for a word..."
              className="p-2 border rounded w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Search
            </button>
          </form>
          {keyword && <InfiniteWords keyword={keyword} />}
        </div>
      </div>
    </>
  );
}
