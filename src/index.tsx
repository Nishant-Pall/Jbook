// we put the esbuild.wasm file in public to make it easy for the browser to fetch the file
import "bulmaswatch/slate/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEdtior from "./components/code-editor";
import Preview from "./components/preview";

const App = () => {
    const ref = useRef<any>();
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");

    // Async function to start the esbuild service
    const startService = async () => {
        // initialization of esbuild-wasm
        // and get reference to service from esbuild
        ref.current = await esbuild.startService({
            // to fetch compiled esbuild.wasm binary from public dir
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
        });
    };

    // we need to call the startService function only once
    useEffect(() => {
        startService();
    }, []);

    const onClick = async () => {
        // check if we actually have the ref to esbuild
        if (!ref.current) {
            return;
        }

        const result = await ref.current.build({
            // entrypoint that will look into the first file
            entryPoints: ["index.js"],
            // set bundling as true
            bundle: true,
            write: false,
            // calling plugins from left to right
            plugins: [unpkgPathPlugin(), fetchPlugin(input)],
            // defining some variables at the time of bundling
            define: {
                "process.env.NODE_ENV": '"production"',
                global: "window",
            },
        });
        setCode(result.outputFiles[0].text);
    };

    return (
        <div>
            <CodeEdtior
                initialValue="const a = 1"
                onChange={(value) => setInput(value)}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <Preview code={code} />
        </div>
    );
};

// sandbox="" ensures blocking a frame (child) with origin "null"
// from accessing a cross origin frame (parent)
// this works as a two way street
// sandbox="allow-same-origin" ensures access

ReactDOM.render(<App />, document.querySelector("#root"));
