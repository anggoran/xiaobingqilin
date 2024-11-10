import { assert } from "$std/assert/assert.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertExists } from "$std/assert/assert_exists.ts";
import { CONNECTION, handler } from "./main_test.ts";

export const renderCreationForm = async () => {
  const req = new Request("http://localhost/reading");
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

  const req = new Request("http://localhost/reading", {
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

export const postAnswer = async () => {
  const formData = new FormData();
  formData.append("q_id", "247");
  formData.append("initial", "ni");
  formData.append("tone", "3");

  const req = new Request("http://localhost/reading/我是印尼人", {
    method: "POST",
    body: formData,
  });
  const resp = await handler(req, CONNECTION).then((value) => {
    const url = new URL(value.headers.get("location")!);
    assertEquals(value.status, 303);
    assertExists(url.searchParams.get("q_id"));
    assertExists(url.searchParams.get("a"));
    return handler(new Request(url!));
  });
  const text = await resp.text();

  assert(resp.ok);
  assert(text.includes("<b>The solution:</b> nǐ"));
};

export const getCorrectState = async () => {
  const req = new Request(
    "http://localhost/reading/中国银行?q_id=5573&a=xíng",
  );
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  console.log(resp.status);

  assert(resp.ok);
  assert(
    text.includes('<div class="h-screen content-center bg-green-300">'),
  );
};

export const getFalseState = async () => {
  const req = new Request(
    "http://localhost/reading/中国银行?q_id=5573&a=hǎo",
  );
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();

  assert(resp.ok);
  assert(
    text.includes('<div class="h-screen content-center bg-red-300">'),
  );
};
