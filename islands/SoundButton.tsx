export function SoundButton(
  { text, sound }: { text: string; sound: string },
) {
  const playPinyin = () => {
    const u = new SpeechSynthesisUtterance();
    const voices = speechSynthesis.getVoices();
    u.lang = "zh-CN";
    u.text = sound;
    u.rate = 0.25;
    u.pitch = 0.75;
    u.voice = voices.find((v) => v.lang === "zh-CN")!;
    return speechSynthesis.speak(u);
  };

  return <button type="button" onClick={playPinyin}>{text}</button>;
}
