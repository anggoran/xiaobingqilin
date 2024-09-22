import * as CSV from "jsr:@std/csv";

interface HanziPinyin {
  hanzi_id: number;
  pinyin_id: number;
}

const readPinyinCSV = async () => {
  const content = await Deno.readTextFile("./static/data/pinyin.csv");
  return CSV.parse(content).map((row) => row[1] + row[2]).slice(1);
};

const readHanziCSV = async () => {
  const content = await Deno.readTextFile("./static/data/hanzi.csv");
  return CSV.parse(content).map((row) => row[0]).slice(1);
};

const readCedictTXT = async () => {
  const cedictContent = await Deno.readTextFile("./static/data/cedict.txt");
  return cedictContent.split("\n");
};

const createCedictList = async () => {
  const cedictLines = await readCedictTXT();
  const hanziList = await readHanziCSV();
  const cedictList: { simplified: string; pinyin: string }[] = [];
  cedictLines.forEach((line) => {
    const parts = line.split(" ");
    const hanzisAreExist = parts[1].split("").every((e) =>
      hanziList.includes(e)
    );
    if (!hanzisAreExist) return;
    cedictList.push({
      simplified: parts[1],
      pinyin: parts.slice(2, parts.findIndex((e) => e.endsWith("]")) + 1)
        .join(" ").slice(1, -1).toLowerCase().replaceAll("u:", "v")
        .replaceAll("5", ""),
    });
  });
  return cedictList;
};

const createHanziPinyinList = async () => {
  // for cedict, map not only hanzi, but also the words!
  const pinyinList = await readPinyinCSV();
  const cedictList = await createCedictList();
  const hanziList = await readHanziCSV();
  const hpSet = new Set<string>();
  const hpList: HanziPinyin[] = [];
  cedictList.forEach((cedict) => {
    const cedictHanzis = cedict.simplified.split("");
    const cedictPinyins = cedict.pinyin.split(" ");
    cedictHanzis.forEach((hanzi, index) => {
      const pinyin = cedictPinyins[index];
      const hpCode = hanzi + " : " + pinyin;
      const pIndex = pinyinList.findIndex((e) => e === pinyin);
      const hIndex = hanziList.findIndex((e) => e === hanzi);
      if (hIndex !== -1 && pIndex !== -1 && !hpSet.has(hpCode)) {
        hpList.push({ hanzi_id: hIndex + 1, pinyin_id: pIndex + 1 });
        hpSet.add(hpCode);
      }
    });
  });
  return hpList;
};

const writeHanziPinyinCSV = async () => {
  const hpList = await createHanziPinyinList();
  const content = CSV.stringify(hpList as unknown as CSV.DataItem[], {
    columns: ["hanzi_id", "pinyin_id"],
  });
  await Deno.writeTextFile("./static/data/hanzipinyin.csv", content);
};

await writeHanziPinyinCSV();
