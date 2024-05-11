export const readTXT = async (
  data: string,
) => {
  const name = Deno.cwd() + `/static/data/${data}.txt`;
  const content = await Deno.readTextFile(name);
  return content.split("\n");
};
