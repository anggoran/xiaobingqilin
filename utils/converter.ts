import { decodeBase64 } from "@std/encoding/base64";

export const base64ToString = (base64: string) => {
  return new TextDecoder().decode(decodeBase64(base64));
};
