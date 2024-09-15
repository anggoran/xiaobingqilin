import { useSignal } from "@preact/signals";
import { HanziPinyinModel } from "../../../models/hanzi.ts";

interface HanziTableProps {
  hpList: HanziPinyinModel[];
  pageNumbers: number[];
}

export default function HanziTable({ props }: { props: HanziTableProps }) {
  const { hpList, pageNumbers } = props;
  const expanded = useSignal<number[]>([]);

  const hasLongChars = (meaning: string) => {
    return meaning.split(";").length > 2 || meaning.length > 80;
  };

  const expandRow = (index: number) => {
    expanded.value = expanded.value.includes(index)
      ? expanded.value.filter((i) => i !== index)
      : [...expanded.value, index];
  };

  const styledCell = (meaning: string, index: number) => {
    if (!hasLongChars(meaning)) return "h-12 content-center";
    if (expanded.value.includes(index)) return "content-center";

    return "h-6 text-ellipsis overflow-hidden";
  };

  return (
    <table className="table-fixed">
      <thead>
        <tr>
          {["", "Form", "Sound", "Meaning"].map((header) => (
            <th className="p-1 border border-gray-500">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hpList.map((elem, index) => {
          const { id, hanzi, pinyin } = elem;

          return (
            <tr key={index}>
              <td className="w-16 p-1 border border-gray-500 text-center">
                {pageNumbers[index]}
              </td>
              <td className="w-20 p-1 border border-gray-500 text-center text-blue-500">
                <a href={"/hanzi" + `/${id}`}>{hanzi.form}</a>
              </td>
              <td className="w-20 p-1 border border-gray-500 text-center">
                {pinyin.name}
              </td>
              <td className="w-96 text-sm px-2 py-1 border border-gray-500">
                <ul className={styledCell(hanzi.meaning, index)}>
                  {hanzi.meaning.split(";").length > 1
                    ? hanzi.meaning.split(";").map((elem) => (
                      <li>{"• " + elem.trim()}</li>
                    ))
                    : <li>{hanzi.meaning}</li>}
                </ul>
                {hasLongChars(hanzi.meaning) && (
                  <button
                    onClick={() => expandRow(index)}
                    className="text-xs p-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
                  >
                    {expanded.value.includes(index) ? "Collapse" : "Expand"}
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
