import * as CSV from "jsr:@std/csv";

interface Word {
  hanzi: string;
  pinyin: string;
  english: string;
}

const readPinyinCSV = async () => {
  const content = await Deno.readTextFile("./static/data/pinyin.csv");
  return CSV.parse(content).map((row) => ({
    sound: row[0],
    latin: row[1],
    tone: row[2],
  })).slice(1);
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
        .join(" ").slice(1, -1).toLowerCase()
        .replaceAll("5", "").replaceAll("u:", "v").replaceAll(/\br\b/g, "er"),
      english: parts.slice(parts.findIndex((e) => e.endsWith("]")) + 1)
        .join(" ").replaceAll("/", "; ").slice(2, -3),
    });
  });
  return cedictList;
};

const createWordList = async () => {
  const pinyinList = await readPinyinCSV();
  const cedictList = await createCedictList();

  const wordList: Word[] = [];
  cedictList.forEach((cedict) => {
    const pinyinData: string[] = [];
    cedict.pinyins.split(" ").forEach((cp) => {
      const pinyin = pinyinList.find((p) => (p.latin + p.tone) === cp);
      if (pinyin) pinyinData.push(pinyin.sound);
    });
    wordList.push({
      hanzi: cedict.hanzis,
      pinyin: pinyinData.join(" "),
      english: cedict.english,
    });
  });

  return wordList;
};

const writeWordCSV = async () => {
  const wordList = await createWordList();
  const content = CSV.stringify(wordList as unknown as CSV.DataItem[], {
    columns: ["hanzi", "pinyin", "english"],
  });
  await Deno.writeTextFile("./static/data/word.csv", content);
};

await writeWordCSV();
