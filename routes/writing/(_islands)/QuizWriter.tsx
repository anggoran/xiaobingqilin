import HanziWriter from "hanzi-writer";
import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useEffect } from "preact/hooks";

export default function QuizWriter(
  { hasStarted }: { hasStarted: Signal<boolean> },
) {
  let hanzi: HanziWriter;

  const onStart = () => {
    hanzi?.quiz();
    hasStarted.value = true;
  };

  useEffect(() => {
    hanzi = HanziWriter.create("quiz", "我", {
      width: 100,
      height: 100,
      padding: 5,
      strokeColor: "#808080",
      drawingColor: "#000000",
      highlightCompleteColor: "#0000ff",
      drawingWidth: 20,
      showOutline: false,
      showHintAfterMisses: false,
      showCharacter: false,
    });
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <svg
          id="quiz"
          className={`${
            hasStarted.value ? "opacity-100" : "opacity-0"
          } duration-300 transition-opacity stroke-gray-200`}
        >
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
          <rect
            width="100"
            height="100"
            stroke-width={5}
            className="fill-none stroke-black"
          />
        </svg>
        <button type="button" onClick={onStart}>
          Start quiz
        </button>
      </div>
    </>
  );
}
