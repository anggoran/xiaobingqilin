export interface WordModel {
  id: number;
  hanzi: string;
  pinyin: string;
  english: string;
}

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
  sound: string;
  latin: string;
  tone: number | null;
}
