import * as CSV from "jsr:@std/csv";

interface Hanzi {
  form: string;
  meaning: string;
  type: string;
  etymology: string;
}

const readPinyinCSV = async () => {
  const content = await Deno.readTextFile("./static/data/pinyin.csv");
  return CSV.parse(content).map((row) => row[1] + row[2]).slice(1);
};

const readUnihanTXT = async () => {
  const content = await Deno.readTextFile("./static/data/unihan.txt");
  return content.trim().split("\n");
};

const readCedictTXT = async () => {
  const cedictContent = await Deno.readTextFile("./static/data/cedict.txt");
  return cedictContent.split("\n");
};

const createUnihanList = async () => {
  const unihanLines = await readUnihanTXT();
  return unihanLines.map((line) => {
    const parsedLine = JSON.parse(line);
    const hasPhilosophy = parsedLine["etymology"] !== undefined;
    return {
      character: parsedLine["character"],
      definition: parsedLine["definition"],
      type: hasPhilosophy ? parsedLine["etymology"]["type"] : "",
      etymology: hasPhilosophy ? parsedLine["etymology"]["hint"] : "",
    };
  });
};

const createCedictList = async () => {
  const cedictLines = await readCedictTXT();
  return cedictLines.map((line) => {
    const parts = line.split(" ");
    const data = {
      simplified: parts[1],
      pinyin: parts[2].slice(1, -1).toLowerCase()
        .replace("u:", "v").replace("5", ""),
    };
    if (data.simplified === "儿" && data.pinyin === "r5") {
      data.pinyin = "er5";
    } else if (data.simplified === "剋" && data.pinyin === "kei1") {
      data.pinyin = "ke4";
    } else if (data.simplified === "忒" && data.pinyin === "tei1") {
      data.pinyin = "te4";
    }
    return data;
  });
};

const createHanziList = async () => {
  const pinyinList = await readPinyinCSV();
  const cedictList = await createCedictList();
  const unihanList = await createUnihanList();
  const hanziSet = new Set<string>();
  const hanziList: Hanzi[] = [];
  cedictList.forEach((cedict) => {
    const unihan = unihanList.find((e) => e.character === cedict.simplified);
    const pinyin = pinyinList.find((e) => e === cedict.pinyin);
    if (unihan && pinyin && !hanziSet.has(cedict.simplified)) {
      hanziList.push({
        form: cedict.simplified,
        meaning: unihan.definition,
        type: unihan.type,
        etymology: unihan.etymology,
      });
      hanziSet.add(cedict.simplified);
    }
  });
  return hanziList;
};

const writeHanziCSV = async () => {
  const hanziList = await createHanziList();
  const content = CSV.stringify(hanziList as unknown as CSV.DataItem[], {
    columns: ["form", "meaning", "type", "etymology"],
  });
  await Deno.writeTextFile("./static/data/hanzi.csv", content);
};

await writeHanziCSV();
