import { PageProps } from "$fresh/server.ts";

export default function WritingPage(props: PageProps) {
  const data = decodeURIComponent(props.params["quiz"]);
  return <p>{data}</p>;
}
