import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

export default defineConfig({
	server: {
		hostname: "0.0.0.0",
		port: 8000,
	},
	plugins: [tailwind()],
});
