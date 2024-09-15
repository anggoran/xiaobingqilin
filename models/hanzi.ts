export interface HanziPinyinModel {
  id: number;
  hanzi: HanziModel;
  pinyin: PinyinModel;
}

export interface HanziModel {
  id: number;
  form: string;
  meaning: string;
  type: string;
  etymology: string;
}

export interface PinyinModel {
  id: number;
  name: string;
  latin: string;
  tone: number | null;
}
