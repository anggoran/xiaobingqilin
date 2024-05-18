import { assert } from "$std/assert/assert.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { CONNECTION, handler } from "./main_test.ts";

export const renderCreationForm = async () => {
  const req = new Request("http://localhost/writing");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(
    text.includes(
      '<textarea name="hanzis" placeholder="Enter your hanzi list, without any separator."></textarea>',
    ),
  );
};

export const startQuiz = async () => {
  const formData = new FormData();
  formData.append("hanzis", "我是印尼人");

  const req = new Request("http://localhost/writing", {
    method: "POST",
    body: formData,
  });
  const resp = await handler(req, CONNECTION).then((value) => {
    const url = new URL(value.headers.get("location")!);
    assertEquals(value.status, 303);
    return handler(new Request(url!));
  });
  const text = await resp.text();

  assert(resp.ok);
  assert(text.includes("<b>Hint:</b>"));
  assert(text.includes("<b>Question:</b>"));
};

export const getQuizWriter = async () => {
  const req = new Request("http://localhost/writing/人");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  console.log(text);
  assert(
    text.includes(
      '<svg id="quiz-writer" width="100" height="100" class="stroke-white">',
    ),
  );
  assert(
    text.includes(
      '<button class="text-white bg-black disabled:bg-gray-200" type="button">Start quiz</button>',
    ),
  );
};

export const getSolutionWriter = async () => {
  const req = new Request("http://localhost/writing/人");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(
    text.includes(
      '<svg id="solution-writer" width="100" height="100" class="stroke-gray-200">',
    ),
  );
  assert(
    text.includes(
      '<button type="button">Show solution</button>',
    ),
  );
};
