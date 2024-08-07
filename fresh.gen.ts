// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $hanzi_hanzi_ from "./routes/hanzi/[hanzi].tsx";
import * as $hanzi_index from "./routes/hanzi/index.tsx";
import * as $index from "./routes/index.tsx";
import * as $listening_index from "./routes/listening/index.tsx";
import * as $reading_quiz_ from "./routes/reading/[quiz].tsx";
import * as $reading_index from "./routes/reading/index.tsx";
import * as $writing_quiz_ from "./routes/writing/[quiz].tsx";
import * as $writing_index from "./routes/writing/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Dropdown from "./islands/Dropdown.tsx";
import * as $Label from "./islands/Label.tsx";
import * as $Menu from "./islands/Menu.tsx";
import * as $SolutionWriter from "./islands/SolutionWriter.tsx";
import * as $SoundButton from "./islands/SoundButton.tsx";
import * as $hanzi_islands_HanziTable from "./routes/hanzi/(_islands)/HanziTable.tsx";
import * as $writing_islands_QuizWriter from "./routes/writing/(_islands)/QuizWriter.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/hanzi/[hanzi].tsx": $hanzi_hanzi_,
    "./routes/hanzi/index.tsx": $hanzi_index,
    "./routes/index.tsx": $index,
    "./routes/listening/index.tsx": $listening_index,
    "./routes/reading/[quiz].tsx": $reading_quiz_,
    "./routes/reading/index.tsx": $reading_index,
    "./routes/writing/[quiz].tsx": $writing_quiz_,
    "./routes/writing/index.tsx": $writing_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/Dropdown.tsx": $Dropdown,
    "./islands/Label.tsx": $Label,
    "./islands/Menu.tsx": $Menu,
    "./islands/SolutionWriter.tsx": $SolutionWriter,
    "./islands/SoundButton.tsx": $SoundButton,
    "./routes/hanzi/(_islands)/HanziTable.tsx": $hanzi_islands_HanziTable,
    "./routes/writing/(_islands)/QuizWriter.tsx": $writing_islands_QuizWriter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
