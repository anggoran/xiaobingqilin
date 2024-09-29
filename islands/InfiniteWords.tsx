import { useEffect, useRef, useState } from "preact/hooks";
import { WordModel } from "../models/hanzi.ts";

export default function InfiniteWords({ keyword }: { keyword: string }) {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<WordModel[]>([]);
  const [scroll, setScroll] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadMore = async () => {
    setLoading(true);
    const { word: newWords, count } = await fetch(
      `/api/word?keyword=${keyword}&scroll=${scroll}`,
    ).then((res) => res.json());
    setWords((prevWords) => [...prevWords, ...newWords]);
    if (count < 10) setHasMore(false);
    setLoading(false);
  };

  useEffect(() => {
    if (hasMore) loadMore();
  }, [scroll]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setScroll((prevScroll) => prevScroll + 1);
      }
    }, { threshold: 1.0 });

    const currentLoader = loaderRef.current;

    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading]);

  return (
    <>
      <div className="space-y-4">
        {words.map((w) => (
          <div key={w.id} ref={loaderRef} className="p-4 border rounded">
            <p>
              <span class="font-bold">{w.hanzi}</span> {`(${w.pinyin})`}
            </p>
            <p className="text-gray-500">{w.english}</p>
          </div>
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading items...</p>}
    </>
  );
}
