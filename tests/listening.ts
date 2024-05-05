import { assert } from "$std/assert/assert.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertExists } from "$std/assert/assert_exists.ts";
import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";

export const listeningTest = (CONNECTION: ServeHandlerInfo) => {
  Deno.test("Feature: Listening Pinyin", async (t) => {
    const handler = await createHandler(manifest, config);

    await t.step("Get the question", async () => {
      const req = new Request("http://localhost/listening");
      const resp = await handler(req, CONNECTION);
      const text = await resp.text();
      assert(resp.ok);
      assert(text.includes('<button type="button">🔈</button>'));
    });

    await t.step("Post the answer", async () => {
      const formData = new FormData();
      formData.append("question_id", "1057");
      formData.append("initial", "sh");
      formData.append("final", "eng");
      formData.append("tone", "1st tone");
      const req = new Request("http://localhost/listening", {
        method: "POST",
        body: formData,
      });
      const resp = await handler(req, CONNECTION).then((value) => {
        const url = new URL(value.headers.get("location")!);
        assertEquals(value.status, 303);
        assertExists(url.searchParams.get("question"));
        assertExists(url.searchParams.get("answer"));
        assertExists(url.searchParams.get("truth"));
        return handler(new Request(url!));
      });

      const text = await resp.text();
      assert(resp.ok);
      assert(text.includes('<button type="button">shēng</button>'));
    });

    await t.step("Get the correct state", async () => {
      const formData = new FormData();
      formData.append("question_id", "1057");
      formData.append("initial", "sh");
      formData.append("final", "eng");
      formData.append("tone", "1st tone");
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
        text.includes('<div class="h-screen content-center bg-green-300 ">'),
      );
    });

    await t.step("Get the false state", async () => {
      const formData = new FormData();
      formData.append("question_id", "1");
      formData.append("initial", "sh");
      formData.append("final", "eng");
      formData.append("tone", "1st tone");
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
        text.includes('<div class="h-screen content-center bg-red-300 ">'),
      );
    });
  });
};
