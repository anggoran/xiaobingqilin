#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import { backgroundTask } from "./utils/queue.ts";

if (!Deno.args.includes("build")) backgroundTask();

await dev(import.meta.url, "./main.ts", config);
