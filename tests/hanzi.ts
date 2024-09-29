import { assert } from "$std/assert/assert.ts";
import { CONNECTION, handler } from "./main_test.ts";

export const getHanziList = async () => {
  const req = new Request("http://localhost/hanzi?page=115");
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
  assert(text.includes("1141</td>"));
  assert(text.includes('<a href="/hanzi/244">和</a></td>'));
  assert(text.includes("hé</td>"));
  assert(
    text.includes(
      "<li>• harmony, peace</li><li>• calm, peaceful</li></ul>",
    ),
  );
};

export const getHanziDetail = async () => {
  const req = new Request("http://localhost/hanzi/371");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(text.includes("好</h3>"));
  assert(text.includes('svg id="solution-writer"'));

  assert(text.includes("hǎo</button>"));
  assert(
    text.includes(
      "<li>• good, excellent, fine</li><li>•  proper, suitable</li><li>•  well</li></ul>",
    ),
  );
  assert(text.includes("ideographic</h6>"));
  assert(text.includes("A woman 女 with a son 子</p>"));
};
