import * as esbuild from "esbuild-wasm";

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
            // the path of the file, it will prevent esbuild to look into the file system
            // filter is an re, we can make different onResolve
            // functions depending upon the type of files we want to load
            // eg. for Javascript --> filter: '/.js/

            // importer is the destination of the file from
            // which we're importing the package

            // Handle root entry file of 'index.js'
            build.onResolve({ filter: /(^index\.js$)/ }, () => {
                return { path: "index.js", namespace: "a" };
            });

            // Handle relative paths in a module
            build.onResolve({ filter: /^\.+\// }, (args: any) => {
                return {
                    namespace: "a",
                    path: new URL(
                        args.path,
                        "https://unpkg.com" + args.resolveDir + "/"
                    ).href,
                };
            });

            // Handle main file of a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                return {
                    namespace: "a",
                    path: `https://unpkg.com/${args.path}`,
                };
            });
        },
    };
};

// If esbuild finds any imports/require/exporst, esbuild calls
// the onResolve, onLoad functions again
// this process is carried out recursively
