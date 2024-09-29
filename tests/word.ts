import { assert } from "$std/assert/assert.ts";
import { WordModel } from "../models/hanzi.ts";
import { CONNECTION, handler } from "./main_test.ts";

export const getSearchPage = async () => {
  const req = new Request("http://localhost/word");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(text.includes("Word Database</h1>"));
  assert(
    text.includes(
      '<input type="text" name="keyword" value placeholder="Search for a word..."',
    ),
  );
  assert(text.includes("Search</button>"));
};

export const getSearchResult = async () => {
  const req = new Request("http://localhost/api/word?keyword=苹果&scroll=1");
  const resp = await handler(req, CONNECTION);
  const { word, count } = await resp.json();
  const data = word as WordModel[];

  assert(resp.ok);
  assert(count == 10);
  assert(data.map((w) => w.hanzi).includes("苹果公司"));
  assert(data.map((w) => w.pinyin).includes("píng guǒ shǒu jī"));
  assert(data.map((w) => w.english).includes("Apple computer; Mac; Macintosh"));
};
