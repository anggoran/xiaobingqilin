import { JSX } from "preact/jsx-runtime";

export function SoundButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const playPinyin = () => {
    const u = new SpeechSynthesisUtterance();
    u.lang = "zh-CN";
    u.text = "ren2";
    u.rate = 0.25;
    u.pitch = 0.75;
    return window.speechSynthesis.speak(u);
  };

  return <button type="button" onClick={playPinyin}>🔈</button>;
}
