import * as esbuild from "esbuild-wasm";
import axios from "axios";

// returns a plugin object
// esbuild is a little more streamlined than webpack
// in terms of time and space efficiency
export const unpkgPathPlugin = () => {
    return {
        // name of plugin
        name: "unpkg-path-plugin",

        // setup of plugin, called automatically called by esbuild as build
        // build refers to process of processing a file
        setup(build: esbuild.PluginBuild) {
            // overrides natural build process of trying to figure out
            // the path of the file, it will prevent esbuild to look
            // into the file system
            // filter is an re, we can make different onResolve
            // functions depending upon the type of files we want to load
            // eg. for Javascript --> filter: '/.js/
            // for TypeScript --> filter: '/.ts/
            // for CSS --> filter: '/.css/
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log("onResolve", args);

                // onLoad or any other functions will only
                // work on files with namespace a
                // importer is the destination of the file from
                // which we're importing the package
                if (args.path === "index.js") {
                    return { path: args.path, namespace: "a" };
                }

                // will join/concatenate the path to importer path correctly
                if (args.path.includes("./") || args.path.includes("../")) {
                    return {
                        namespace: "a",
                        path: new URL(
                            args.path,
                            "https://unpkg.com" + args.resolveDir + "/"
                        ).href,
                    };
                }
                return {
                    namespace: "a",
                    path: `https://unpkg.com/${args.path}`,
                };
            });

            // attempts to load up a file
            // also overrides the natural loading a file
            // which is directly looking up the file system
            build.onLoad(
                { filter: /.*/, namespace: "a" },
                async (args: any) => {
                    console.log("onLoad", args);

                    // custom object we return onLoad
                    if (args.path === "index.js") {
                        return {
                            loader: "jsx",
                            contents: `
            import React from 'react';
              console.log(React);
            `,
                        };
                    }

                    // axios get request to get the contents of the file
                    const { data, request } = await axios.get(args.path);
                    return {
                        loader: "jsx",
                        contents: data,
                        // will return the path of the last importer to maintain
                        // persistence of path from unpkg modules
                        resolveDir: new URL("./", request.responseURL).pathname,
                    };
                }
            );
        },
    };
};

// If esbuild finds any imports/require/exporst, esbuild calls
// the onResolve, onLoad functions again
// this process is carried out recursively
