import { decodeBase64, decodeBase64Url } from "@std/encoding";

export const base64ToString = (base64: string) => {
	return new TextDecoder().decode(decodeBase64(base64));
};

export const base64URLToString = (base64URL: string) => {
	return new TextDecoder().decode(decodeBase64Url(base64URL));
};
