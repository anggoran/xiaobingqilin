import { ServeHandlerInfo } from "$fresh/server.ts";
import { listeningTest } from "./listening.ts";
import { readingTest } from "./reading.ts";

const CONNECTION: ServeHandlerInfo = {
  remoteAddr: { hostname: "localhost", port: 8000, transport: "tcp" },
};

listeningTest(CONNECTION);
readingTest(CONNECTION);
