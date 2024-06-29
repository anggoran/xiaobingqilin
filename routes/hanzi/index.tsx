export default function Home() {
  return (
    <div className="h-screen content-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <p className="font-bold">Page 1</p>
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
      </div>
    </div>
  );
}
