export interface PinyinModel {
  id: number;
  name: string;
  initial_id: number;
  final_id: number;
  tone_id: number;
  sound_id: string;
}

export interface PinyinPartModel {
  id: number;
  name: string;
}

export interface AnswerModel {
  initial_id: number;
  final_id: number;
  tone_id: number;
}
