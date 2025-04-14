export const generateFisherToken = (value: string) => {
  const string = crypto.randomUUID() + value + new Date().toISOString();
  const array = Array.from(string);
  const uint8 = new Uint8Array(array.length);
  crypto.getRandomValues(uint8);

  for (let i = array.length - 1; i > 0; i--) {
    const j = uint8[i] % (i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array.join("");
};
