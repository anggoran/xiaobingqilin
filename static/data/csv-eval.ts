// OPTIMISTIC
// 儿,er5,"non-syllabic diminutive suffix; retroflex final",pictographic,"Simplified form of 兒, a picture of a child; compare 人"
// 剋,ke4,"to scold; to beat",ideographic,"A weapon刂 used to subdue 十 a beast 兄"
// 忒,te4,"(dialect) too; very",pictophonetic,"heart"
// --------------------
// UNCLEAR
// 呣,m2,"interjection expressing a question",pictophonetic,"mouth"
// 呣,m4,"interjection expressing consent; um",pictophonetic,"mouth"
// 呒,m2,"dialectal equivalent of 沒有|没有[mei2 you3]",pictophonetic,"mouth"
// --------------------
// PESSIMISTIC
// 丷,xx5,"one of the characters used in kwukyel, an ancient Korean writing system",,
// 龶,xx5,"component in Chinese characters, occurring in 青, 毒, 素 etc, referred to as 青字頭|青字头[qing1 zi4 tou2]",,
// 吧,bia1,"(onom.) smack!",pictophonetic,"mouth"

const readSupabasePinyinCSV = async () => {
  const csvContent = await Deno.readTextFile(
    "./static/data/supabase-pinyin.csv",
  );
  const pinyinList = csvContent.split("\n").slice(1).map((line) => {
    const [id, name, latin, tone] = line.split(",");
    return { id, name, latin, tone };
  });
  return pinyinList;
};

const readSupabaseHanziCSV = async () => {
  const csvContent = await Deno.readTextFile(
    "./static/data/supabase-hanzi_pinyin.csv",
  );
  const hanziList = csvContent.split("\n").slice(1).map((line) => {
    const [hanzi, pinyin] = line.split(",");
    return { hanzi, pinyin };
  });
  return hanziList;
};

const getPinyinNotInHanziCSV = async () => {
  const supabasePinyinList = await readSupabasePinyinCSV();
  const supabaseHanziList = await readSupabaseHanziCSV();

  const pinyinNotExist = supabaseHanziList.filter((e) => {
    const newSound = e.pinyin.replace("5", "").replace("u:", "v");
    return !supabasePinyinList.map((e) => e.latin + e.tone).includes(newSound);
  });
  console.log(pinyinNotExist.map((e) => e.pinyin).join(", "));
  console.log(pinyinNotExist.length);
};

await getPinyinNotInHanziCSV();

const getPinyinNotInPinyinCSV = async () => {
  const supabasePinyinList = await readSupabasePinyinCSV();
  const supabaseHanziList = await readSupabaseHanziCSV();

  const pinyinNotExist = supabasePinyinList.filter((e) => {
    return !supabaseHanziList.map((e) => e.pinyin).includes(e.latin + e.tone);
  });
  console.log(pinyinNotExist.map((e) => e.latin + e.tone).join(", "));
  console.log(pinyinNotExist.length);
};

await getPinyinNotInPinyinCSV();
