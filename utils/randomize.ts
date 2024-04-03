import { PinyinModel } from "../models/pinyin.ts";
import { readJSON } from "./read-json.ts";

export const randomize = async () => {
  const json: PinyinModel[] = await readJSON("pinyins");
  const random = Math.random() * (json.length - 1) + 1;
  const result = Math.floor(random);
  return json.find((item) => item.id == result);
};
