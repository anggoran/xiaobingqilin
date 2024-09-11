// a(2345), ei(234), en(5), er(5), ye(5),
// yo(5), yue(3), o(235), wa(5), ba(5),
// bei(5), bian(5), bo(5), pang(3), pen(4),
// po(5), man(1), mi(5), da(5), dui(3),
// tai(3), tou(35), tuan(34), na(15), la(5),
// lei(5), li(5), lie(5), lin(1), lo(5),
// long(1), lou(15), luo(5), ga(3), gei(1),
// guo(5), ha(3), jie(5), jiong(1), jue(3),
// qiong(1), qiu(3), qu(5), qun(1), xin(2),
// xiong(4), zha(5), zhe(5), zhuai(134), zhuang(3),
// cha(3), chai(4), chen(3), chua(1), sha(2),
// shai(3), shang(5), shi(5), shua(4), rui(23),
// zan(3), zang(3), zen(4), zi(5), zou(1),
// zun(4), ca(3), ceng(1), cu(3), cuo(3),
// song(2), suan(3)

// a2, a3, a4, a5, ei2,
// ei3, ei4, en5, er5, ye5,
// yo5, yue3, o2, o3, o5,
// wa5, ba5, bei5, bian5, bo5,
// pang3, pen4, po5, man1, mi5,
// da5, dui3, tai3, tou3, tou5,
// tuan3, tuan4, na1, na5, la5,
// lei5, li5, lie5, lin1, lo5,
// long1, lou1, lou5, luo5, ga3,
// gei1, guo5, ha3, jie5, jiong1,
// jue3, qiong1, qiu3, qu5, qun1,
// xin2, xiong4, zha5, zhe5, zhuai1,
// zhuai3, zhuai4, zhuang3, cha3, chai4,
// chen3, chua1, sha2, shai3, shang5,
// shi5, shua4, rui2, rui3, zan3,
// zang3, zen4, zi5, zou1, zun4,
// ca3, ceng1, cu3, cuo3, song2,
// suan3

// V (r -> er), zhuai, chua
// X xx, kei, bia, m, tei

// interface Pinyin {
//   id: number;
//   name: string;
//   initial_id: number;
//   final_id: number;
//   tone_id: number;
//   sound_id: string;
// }

// interface SupabasePinyin {
//   name: string;
//   latin: string;
//   tone: number | null;
// }

// const supabasePinyinList: SupabasePinyin[] = [];

// const readPinyinJSON = async () => {
//   const pinyinContent = await Deno.readTextFile(
//     "./static/data/pinyins.json",
//   );

//   const pinyinList: Pinyin[] = JSON.parse(pinyinContent)["pinyins"];

//   pinyinList.forEach((pinyin) => {
//     const tone = parseInt(pinyin.sound_id.slice(-1));

//     const pinyinObject: SupabasePinyin = {
//       name: pinyin.name,
//       latin: pinyin.sound_id.slice(0, -1),
//       tone: tone === 5 ? null : tone,
//     };
//     supabasePinyinList.push(pinyinObject);
//   });
// };

// const createSupabasePinyinCSV = async () => {
//   const hanUTF = "\ufeff";
//   const csvHeader = "name,latin,tone" + "\n";
//   const csvContent = supabasePinyinList.map(({ name, latin, tone }) => {
//     return [name, latin, tone].join(",");
//   }).join("\n");

//   await Deno.writeTextFile(
//     "./static/data/supabase-pinyin.csv",
//     hanUTF + csvHeader + csvContent,
//   );
// };

// await readPinyinJSON();
// await createSupabasePinyinCSV();

// ----------------------------

// interface SupabasePinyin {
//   name: string;
//   latin: string;
//   tone: number | null;
// }

// const readSupabasePinyinCSV = async () => {
//   const csvContent = await Deno.readTextFile("./static/data/supabase-pinyin.csv");
//   const pinyinList = csvContent.split("\n").slice(1).map((line, index) => {
//     const [name, latin, tone] = line.split(",");
//     return {
//       id: index + 1,
//       name,
//       latin,
//       tone: tone === "" ? null : parseInt(tone),
//     };
//   });
//   return pinyinList;
// };

// const createSupabasePinyinCSV = async () => {
//   const supabasePinyinList = await readSupabasePinyinCSV();

//   const hanUTF = "\ufeff";
//   const csvHeader = "id,name,latin,tone" + "\n";
//   const csvContent = supabasePinyinList.map(({ id, name, latin, tone }) => {
//     return [id, name, latin, tone].join(",");
//   }).join("\n");

//   await Deno.writeTextFile(
//     "./static/data/supabase-pinyin.csv",
//     hanUTF + csvHeader + csvContent,
//   );
// };

// await createSupabasePinyinCSV();

// ----------------------------

// create models
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

interface SupabasePinyin {
  id: number;
  name: string;
  latin: string;
  tone: number | null;
}

interface SupabaseHanzi {
  id: number;
  form: string;
  sound: string;
  meaning: string;
  type: string;
  etymology: string;
}

const cedictList: Cedict[] = [];
const unihanList: Unihan[] = [];
const supabasePinyinList: SupabasePinyin[] = [];
const supabaseHanziList: SupabaseHanzi[] = [];

// read Cedict TXT
const readCedictTXT = async () => {
  const cedictContent = await Deno.readTextFile(
    "./static/data/cedict.txt",
  );
  const cedictLines = cedictContent.split("\n");

  // remove these lines (EXACT MATCH) from cedict
  // 丷 丷 [xx5]
  // 龶 龶 [xx5]
  // 嘸 呒 [m2]
  // 呣 呣 [m2]
  // 呣 呣 [m4]
  // 吧 吧 [bia1]
  const cleanCedictLines = cedictLines.filter((line) =>
    !line.includes("丷 丷 [xx5]") &&
    !line.includes("龶 龶 [xx5]") &&
    !line.includes("嘸 呒 [m2]") &&
    !line.includes("呣 呣 [m2]") &&
    !line.includes("呣 呣 [m4]") &&
    !line.includes("吧 吧 [bia1]")
  );

  // change these lines (EXACT MATCH) from cedict
  // 兒 儿 [r5] -> 兒 儿 [er5]
  // 剋 剋 [kei1] -> 剋 剋 [ke4]
  // 忒 忒 [tei1] -> 忒 忒 [te4]
  cleanCedictLines.forEach((line) => {
    const parts = line.split(" ");
    const data: Cedict = {
      simplified: parts[1],
      pinyin: parts[2].replace("[", "").replace("]", "").toLowerCase(),
      english: parts.slice(3).join(" ").replaceAll("/", "; ").slice(2, -3),
    };
    if (data.simplified === "儿" && data.pinyin === "r5") {
      data.pinyin = "er5";
    } else if (data.simplified === "剋" && data.pinyin === "kei1") {
      data.pinyin = "ke4";
    } else if (data.simplified === "忒" && data.pinyin === "tei1") {
      data.pinyin = "te4";
    }
    cedictList.push(data);
  });
};

// read Unihan TXT
const readUnihanTXT = async () => {
  const unihanContent = await Deno.readTextFile(
    "./static/data/unihan.txt",
  );
  const unihanLines = unihanContent.trim().split("\n");

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
};

// read Supabase Pinyin CSV, push to supabasePinyinList
const readSupabasePinyinCSV = async () => {
  const pinyinLines = await Deno.readTextFile(
    "./static/data/supabase-pinyin.csv",
  );
  pinyinLines.split("\n").slice(1).map((line) => {
    const [id, name, latin, tone] = line.split(",");
    supabasePinyinList.push({
      id: parseInt(id),
      name,
      latin,
      tone: tone === "" ? null : parseInt(tone),
    });
  });
};

// create Supabase Hanzi List
const createSupabaseHanziList = async () => {
  await readCedictTXT();
  await readUnihanTXT();

  cedictList.forEach((cedict) => {
    const unihan = unihanList.find((unihan) =>
      unihan.simplified === cedict.simplified
    );
    // const supabasePinyin = supabasePinyinList.find((e) => {
    //   const newCedictPinyin = cedict.pinyin.replace("5", "").replace("u:", "v");
    //   return `${e.latin + (e.tone ?? "")}` === newCedictPinyin;
    // });
    if (unihan) {
      const data: SupabaseHanzi = {
        id: supabaseHanziList.length + 1,
        form: cedict.simplified,
        // sound: newCedictPinyin,
        // sound: (supabasePinyin?.id ?? cedict.pinyin).toString(),
        sound: cedict.pinyin.replace("5", "").replace("u:", "v"),
        meaning: cedict.english,
        type: unihan.type,
        etymology: unihan.etymology,
      };
      supabaseHanziList.push(data);
    }
  });
};

await readSupabasePinyinCSV();
await createSupabaseHanziList();

// create Supabase Hanzi CSV
const createSupabaseHanziCSV = async () => {
  const hanUTF = "\ufeff";
  const csvHeader = "id,form,meaning,type,etymology" + "\n";
  const csvContent = supabaseHanziList.map((data) => {
    const id = data.id;
    const form = data.form;
    // const sound = data.sound;
    const meaning = `"${data.meaning.replaceAll(/"/g, '""')}"`;
    const type = data.type;
    const etymology = data.etymology
      ? `"${data.etymology.replaceAll(/"/g, '""')}"`
      : "";
    return [id, form, meaning, type, etymology].join(",");
  }).join("\n");

  await Deno.writeTextFile(
    "./static/data/supabase-hanzi.csv",
    hanUTF + csvHeader + csvContent,
  );
};

// create Supabase Hanzi CSV
const createSupabaseHanziPinyinCSV = async () => {
  const hanUTF = "\ufeff";
  const csvHeader = "id,hanzi_id,pinyin_id" + "\n";
  const csvContent = supabaseHanziList.map((data, index) => {
    const id = index + 1;
    const hanzi_id = index + 1;
    const pinyin_id = supabasePinyinList.find((e) =>
      (e.latin + (e.tone ?? "")) === data.sound
    )?.id;
    return [id, hanzi_id, pinyin_id].join(",");
  }).join("\n");

  await Deno.writeTextFile(
    "./static/data/supabase-hanzi_pinyin.csv",
    hanUTF + csvHeader + csvContent,
  );
};

await createSupabaseHanziCSV();
await createSupabaseHanziPinyinCSV();

// ----------------------------

// const noSound = ["xx", "kei", "bia", "m", "tei"];

// // create models
// interface Cedict {
//   simplified: string;
//   pinyin: string;
//   english: string;
// }

// interface Unihan {
//   simplified: string;
//   type: string;
//   etymology: string;
// }

// interface SupabaseHanzi {
//   form: string;
//   sound: string;
//   meaning: string;
//   type: string;
//   etymology: string;
// }
