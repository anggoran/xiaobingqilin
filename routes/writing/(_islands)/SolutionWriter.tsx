import HanziWriter from "hanzi-writer";
import { useEffect } from "preact/hooks";

export default function QuizWriter() {
  let hanzi: HanziWriter;

  const onStart = () => {
    hanzi.showOutline();
    hanzi.animateCharacter();
  };

  useEffect(() => {
    hanzi = HanziWriter.create(
      "solution",
      "我",
      {
        width: 100,
        height: 100,
        padding: 5,
        strokeColor: "#000000",
        radicalColor: "#0000ff",
        showCharacter: false,
        showOutline: false,
        strokeAnimationSpeed: 2,
        delayBetweenStrokes: 100,
        charDataLoader: async function (char) {
          const response = await fetch(
            `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${char}.json`,
          );
          if (!response.ok) {
            throw new Error(`Failed to load character data for ${char}`);
          }
          return await response.json();
        },
      },
    );
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <svg
          id="solution"
          width="100"
          height="100"
        >
          <line x1="0" y1="0" x2="100" y2="100" stroke="#EFEFEF" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#EFEFEF" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#EFEFEF" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#EFEFEF" />
          <rect
            width="100"
            height="100"
            fill="none"
            stroke="#000"
            stroke-width={5}
          />
        </svg>
        <button type="button" onClick={onStart}>
          Show solution
        </button>
      </div>
    </>
  );
}
