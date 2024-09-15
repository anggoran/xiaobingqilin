import { Handlers, PageProps } from "$fresh/server.ts";
import PageNavigator from "../../components/PageNavigator.tsx";
import { getHanziList } from "../../controllers/hanzi.ts";
import { HanziPinyinModel } from "../../models/hanzi.ts";
import { paginate } from "../../utils/paginate.ts";
import HanziTable from "./(_islands)/HanziTable.tsx";

interface Data {
  totalPages: number;
  hpList: HanziPinyinModel[];
  startOrder: number;
  endOrder: number;
}

export const handler: Handlers<Data> = {
  GET: (req, ctx) => getHanziList(req, ctx),
};

export default function HanziPage(props: PageProps<Data>) {
  const currentPage = parseInt(props.url.searchParams.get("page") || "1");
  const { totalPages, hpList, startOrder, endOrder } = props.data;
  const pagination = paginate(currentPage, totalPages);

  const pageNumbers = Array.from(
    { length: endOrder - startOrder + 1 },
    (_, i) => i + startOrder,
  );

  return (
    <>
      <a href="/">Back to home</a>
      <div className="h-auto content-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <p className="font-bold">Page {currentPage}</p>
          <HanziTable props={{ hpList, pageNumbers }} />
          <PageNavigator props={{ currentPage, totalPages, pagination }} />
        </div>
      </div>
    </>
  );
}
