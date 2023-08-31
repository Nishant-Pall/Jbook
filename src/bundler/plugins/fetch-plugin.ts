import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

// fileCache is used to set item or get items from the database
// localForage improves the offline experience of your web app by using asynchronous storage (IndexedDB or WebSQL) with a simple, localStorage-like API.
const fileCache = localForage.createInstance({
	name: "filecache",
});

// fetchPlugin attempts to load up a file
// also overrides the natural loading a file
// which is directly looking up the file system

// onLoad should return an interface of type
// export interface OnLoadResult {
//   pluginName?: string;

//   errors?: PartialMessage[];
//   warnings?: PartialMessage[];

//   contents?: string | Uint8Array;
//   resolveDir?: string;
//   loader?: Loader;
// }
export const fetchPlugin = (inputCode: string) => {
	return {
		name: "fetch-plugin",
		setup(build: esbuild.PluginBuild) {
			build.onLoad({ filter: /(^index\.js$)/ }, () => {
				// custom object we return onLoad
				return {
					loader: "jsx",
					contents: inputCode,
				};
			});
			// if we dont return anything, esbuild will just carry
			// on executing other onLoads until it gets a returned value
			build.onLoad({ filter: /.*/ }, async (args: any) => {
				const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

				// if it is in cache return it
				if (cachedResult) {
					return cachedResult;
				}
			});
			build.onLoad({ filter: /.css$/ }, async (args: any) => {
				// axios get request to get the contents of the file
				const { data, request } = await axios.get(args.path);

				// filtering the fetched css to avoid conflicts with js
				const escaped = data
					//  new lines escaped
					.replace(/\n/g, "")
					//  double quotes escaped
					.replace(/"/g, '\\"')
					// single quotes escaped
					.replace(/'/g, "\\'");
				// get css and wrap it into javascript
				// and append into style element inside the head tag
				const contents = `
                        const style = document.createElement('style');
                        style.innerText = '${escaped}';
                        document.head.appendChild(style);
                    `;

				// result should be of type esbuild.onLoadResult
				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents,
					// will return the path of the last importer to maintain
					// persistence of path from unpkg modules
					resolveDir: new URL("./", request.responseURL).pathname,
				};

				// store response in cache
				await fileCache.setItem(args.path, result);

				return result;
			});
			build.onLoad({ filter: /.*/, namespace: "a" }, async (args: any) => {
				console.log("onLoad", args);

				// axios get request to get the contents of the file
				const { data, request } = await axios.get(args.path);

				// result should be of type esbuild.onLoadResult
				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: data,
					// will return the path of the last importer to maintain
					// persistence of path from unpkg modules
					resolveDir: new URL("./", request.responseURL).pathname,
				};

				// store response in cache
				await fileCache.setItem(args.path, result);

				return result;
			});
		},
	};
};
