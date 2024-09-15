import { assert } from "$std/assert/assert.ts";
import { CONNECTION, handler } from "./main_test.ts";

export const getHanziList = async () => {
  const req = new Request("http://localhost/hanzi?page=111");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(
    text.match(/<tr\s*[^>]*>/gi)?.length === 11,
    "There should be 1 header and 10 data.",
  );

  ["", "Form", "Sound", "Meaning"].forEach((header) => {
    const headerHTML = "[_]</th>";
    assert(text.includes(headerHTML.replace("[_]", header)));
  });
  assert(text.includes("1102</td>"));
  assert(text.includes('<a href="/hanzi/975">只</a></td>'));
  assert(text.includes("zhǐ</td>"));
  assert(
    text.includes(
      "<li>• only</li><li>• merely</li><li>• just</li></ul>",
    ),
  );
};

export const getHanziDetail = async () => {
  const req = new Request("http://localhost/hanzi/1811");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(text.includes("好</h3>"));
  assert(text.includes('svg id="solution-writer"'));

  assert(text.includes("hǎo</button>"));
  assert(
    text.includes("<li>• good</li><li>•  appropriate</li><li>•  proper</li>"),
  );
  assert(text.includes("ideographic</h6>"));
  assert(text.includes("A woman 女 with a son 子</p>"));
};
