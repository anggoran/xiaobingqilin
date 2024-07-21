interface Cedict {
  simplified: string;
  pinyin: string;
  english: string;
}

interface Unihan {
  simplified: string;
  type: string;
  etymology: string;
}

interface Supabase {
  form: string;
  sound: string;
  meaning: string;
  type: string;
  etymology: string;
}

const cedictContent = await Deno.readTextFile(
  "./static/data/cedict.txt",
);
const cedictLines = cedictContent.split("\n");

const cedictList: Cedict[] = [];
cedictLines.forEach((line) => {
  const parts = line.split(" ");
  const data: Cedict = {
    simplified: parts[1],
    pinyin: parts[2].replace("[", "").replace("]", "").toLowerCase(),
    english: parts.slice(3).join(" ").replaceAll("/", "; ").slice(2, -3),
  };
  cedictList.push(data);
});

const unihanContent = await Deno.readTextFile(
  "./static/data/unihan.txt",
);
const unihanLines = unihanContent.trim().split("\n");

const unihanList: Unihan[] = [];
unihanLines.forEach((line) => {
  const parsedUnihan = JSON.parse(line);
  const isExist = parsedUnihan["etymology"] !== undefined;
  const data: Unihan = {
    simplified: parsedUnihan["character"],
    type: isExist ? parsedUnihan["etymology"]["type"] : "",
    etymology: isExist ? parsedUnihan["etymology"]["hint"] : "",
  };
  unihanList.push(data);
});

const supabaseList: Supabase[] = [];
cedictList.forEach((cedict) => {
  const unihan = unihanList.find((unihan) =>
    unihan.simplified === cedict.simplified
  );
  if (unihan) {
    const data: Supabase = {
      form: cedict.simplified,
      sound: cedict.pinyin,
      meaning: cedict.english,
      type: unihan.type,
      etymology: unihan.etymology,
    };
    supabaseList.push(data);
  }
});

const hanUTF = "\ufeff";
const csvHeader = "form,sound,meaning,type,etymology" + "\n";
const csvContent = supabaseList.map((data) => {
  const form = data.form;
  const sound = data.sound;
  const meaning = `"${data.meaning.replaceAll(/"/g, '""')}"`;
  const type = data.type;
  const etymology = data.etymology
    ? `"${data.etymology.replaceAll(/"/g, '""')}"`
    : "";
  return [form, sound, meaning, type, etymology].join(",");
}).join("\n");

await Deno.writeTextFile(
  "./static/data/supabase.csv",
  hanUTF + csvHeader + csvContent,
);
