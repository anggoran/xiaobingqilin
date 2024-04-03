export const readJSON = async (
  data: string,
) => {
  const name = `${Deno.cwd()}/static/data/${data}.json`;
  const text = await Deno.readTextFile(name);
  return JSON.parse(text)[data];
};
