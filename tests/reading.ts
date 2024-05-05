import { assert } from "$std/assert/assert.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertExists } from "$std/assert/assert_exists.ts";
import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";

export const readingTest = (CONNECTION: ServeHandlerInfo) => {
  Deno.test("Feature: Reading Hanzi", async (t) => {
    const handler = await createHandler(manifest, config);

    await t.step("Show quiz creation form", async () => {
      const req = new Request("http://localhost/reading");
      const resp = await handler(req, CONNECTION);
      const text = await resp.text();

      assert(resp.ok);
      assert(
        text.includes(
          '<textarea name="hanzis" placeholder="Enter your hanzi list, without any separator."></textarea>',
        ),
      );
    });

    await t.step("Start a quiz", async () => {
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
      assert(text.includes("<b>Question:</b>"));
    });

    await t.step("Answer the quiz", async () => {
      const formData = new FormData();
      formData.append("question", "我");
      formData.append("initial", "-");
      formData.append("final", "uo");
      formData.append("tone", "3rd tone");

      const req = new Request("http://localhost/reading/我是印尼人", {
        method: "POST",
        body: formData,
      });
      const resp = await handler(req, CONNECTION).then((value) => {
        const url = new URL(value.headers.get("location")!);
        assertEquals(value.status, 303);
        assertExists(url.searchParams.get("question"));
        assertExists(url.searchParams.get("answer"));
        return handler(new Request(url!));
      });
      const text = await resp.text();

      assert(resp.ok);
      assert(text.includes("<b>Solution:</b>"));
    });

    await t.step("Get correct state", async () => {
      const req = new Request(
        "http://localhost/reading/我是印尼人?question=我&answer=wǒ",
      );
      const resp = await handler(req, CONNECTION);
      const text = await resp.text();

      assert(resp.ok);
      assert(
        text.includes('<div class="h-screen content-center bg-green-300 ">'),
      );
    });

    await t.step("Get false state", async () => {
      const req = new Request(
        "http://localhost/reading/我是印尼人?question=人&answer=nǐ",
      );
      const resp = await handler(req, CONNECTION);
      const text = await resp.text();

      assert(resp.ok);
      assert(
        text.includes('<div class="h-screen content-center bg-red-300 ">'),
      );
    });
  });
};
