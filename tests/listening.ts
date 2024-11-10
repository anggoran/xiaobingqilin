import { assert } from "$std/assert/assert.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertExists } from "$std/assert/assert_exists.ts";
import { CONNECTION, handler } from "./main_test.ts";

export const getQuestion = async () => {
  const req = new Request("http://localhost/listening");
  const resp = await handler(req, CONNECTION);
  const text = await resp.text();
  assert(resp.ok);
  assert(text.includes('<button type="button">🔈</button>'));
};

export const postAnswer = async () => {
  const formData = new FormData();
  formData.append("q_id", "2617");
  formData.append("latin", "wo");
  formData.append("tone", "3");
  const req = new Request("http://localhost/listening", {
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
  assert(text.includes('<button type="button">The solution: wǒ</button>'));
};

export const getCorrectState = async () => {
  const formData = new FormData();
  formData.append("q_id", "2323");
  formData.append("latin", "dei");
  formData.append("tone", "3");
  const req = new Request("http://localhost/listening", {
    method: "POST",
    body: formData,
  });
  const resp = await handler(req, CONNECTION).then((value) => {
    const url = value.headers.get("location");
    assertEquals(value.status, 303);
    return handler(new Request(url!));
  });

  const text = await resp.text();
  assert(resp.ok);
  assert(
    text.includes('<div class="h-screen content-center bg-green-300">'),
  );
};

export const getFalseState = async () => {
  const formData = new FormData();
  formData.append("q_id", "2323");
  formData.append("latin", "de");
  formData.append("tone", "");
  const req = new Request("http://localhost/listening", {
    method: "POST",
    body: formData,
  });
  const resp = await handler(req, CONNECTION).then((value) => {
    const url = value.headers.get("location");
    assertEquals(value.status, 303);
    return handler(new Request(url!));
  });

  const text = await resp.text();
  assert(resp.ok);
  assert(
    text.includes('<div class="h-screen content-center bg-red-300">'),
  );
};
