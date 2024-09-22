import * as CSV from "jsr:@std/csv";

interface Word {
  hanzi_pinyin_ids: (number | undefined)[];
  english: string;
}

const readPinyinCSV = async () => {
  const content = await Deno.readTextFile("./static/data/pinyin.csv");
  return CSV.parse(content).map((row) => row[1] + row[2]).slice(1);
};

const readHanziCSV = async () => {
  const content = await Deno.readTextFile("./static/data/hanzi.csv");
  return CSV.parse(content).map((row) => row[0]).slice(1);
};

const readHanziPinyinCSV = async () => {
  const content = await Deno.readTextFile("./static/data/hanzipinyin.csv");
  return CSV.parse(content).map((row) => ({
    hanzi_id: parseInt(row[0]),
    pinyin_id: parseInt(row[1]),
  })).slice(1);
};

const readCedictTXT = async () => {
  const cedictContent = await Deno.readTextFile("./static/data/cedict.txt");
  return cedictContent.split("\n");
};

const createCedictList = async () => {
  const cedictLines = await readCedictTXT();
  const hanziList = await readHanziCSV();
  const cedictList: { hanzis: string; pinyins: string; english: string }[] = [];
  cedictLines.forEach((line) => {
    const parts = line.split(" ");
    const hanzisAreExist = parts[1].split("").every((e) =>
      hanziList.includes(e)
    );
    if (!hanzisAreExist) return;
    cedictList.push({
      hanzis: parts[1],
      pinyins: parts.slice(2, parts.findIndex((e) => e.endsWith("]")) + 1)
        .join(" ").slice(1, -1).toLowerCase().replaceAll("u:", "v")
        .replaceAll("5", ""),
      english: parts.slice(parts.findIndex((e) => e.endsWith("]")) + 1)
        .join(" ").replaceAll("/", "; ").slice(2, -3),
    });
  });
  return cedictList;
};

const createWordList = async () => {
  const pinyinList = await readPinyinCSV();
  const hanziList = await readHanziCSV();
  const hpList = await readHanziPinyinCSV();
  const cedictList = await createCedictList();

  const hMap = new Map(hanziList.map((h, index) => [h, index + 1]));
  const pMap = new Map(pinyinList.map((p, index) => [p, index + 1]));
  const hpMap = new Map(
    hpList.map((hp, index) => [`${hp.hanzi_id}-${hp.pinyin_id}`, index + 1]),
  );

  const wordList: Word[] = [];
  cedictList.forEach((cedict) => {
    const cedictHanzis = cedict.hanzis.split("");
    const cedictPinyins = cedict.pinyins.split(" ");
    const hpIndices = cedictHanzis.map((hanzi, index) => {
      const pinyin = cedictPinyins[index];
      const hanziID = hMap.get(hanzi);
      const pinyinID = pMap.get(pinyin);
      return hanziID !== undefined && pinyinID !== undefined
        ? hpMap.get(`${hanziID}-${pinyinID}`)
        : undefined;
    }).filter((index) => index !== undefined);

    wordList.push({
      hanzi_pinyin_ids: hpIndices,
      english: cedict.english,
    });
  });

  return wordList;
};

const writeWordCSV = async () => {
  const wordList = await createWordList();
  const content = CSV.stringify(wordList as unknown as CSV.DataItem[], {
    columns: ["hanzi_pinyin_ids", "english"],
  });
  await Deno.writeTextFile("./static/data/word.csv", content);
};

await writeWordCSV();
