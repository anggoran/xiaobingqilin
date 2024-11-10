export interface PinyinModel {
  latin: string;
  tone: number | null;
}

export const tones = [
  { label: "1st tone", value: 1 },
  { label: "2nd tone", value: 2 },
  { label: "3rd tone", value: 3 },
  { label: "4rd tone", value: 4 },
  { label: "no tone", value: null },
];
