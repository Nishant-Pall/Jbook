import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;
const bundle = async (rawCode: string) => {
	if (!service) {
		service = await esbuild.startService({
			// to fetch compiled esbuild.wasm binary from public dir
			worker: true,
			wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
		});
	}

	try {
		const result = await service.build({
			// entrypoint that will look into the first file
			entryPoints: ["index.js"],
			// set bundling as true
			bundle: true,
			write: false,
			// calling plugins from left to right
			plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
			// defining some variables at the time of bundling
			define: {
				"process.env.NODE_ENV": '"production"',
				global: "window",
			},
		});
		return { code: result.outputFiles[0].text, err: "" };
	} catch (err: any) {
		return {
			code: "",
			err: err.message,
		};
	}
};

export default bundle;
