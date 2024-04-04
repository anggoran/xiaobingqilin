import { PinyinModel } from "../models/pinyin.ts";

export const randomize = (data: PinyinModel[]) => {
  const random = Math.random() * (data.length - 1) + 1;
  const result = Math.floor(random);
  return data.find((item) => item.id == result);
};
