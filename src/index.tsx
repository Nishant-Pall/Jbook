// we put the esbuild.wasm file in public to make it easy for the browser to fetch the file
import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
    const ref = useRef<any>();
    const iframe = useRef<any>();
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

        // sending our output to iframe
        iframe.current.contentWindow.postMessage(
            result.outputFiles[0].text,
            "*"
        );
    };

    const html = `
        <html>
            <head>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message' ,(event)=>{
                        eval(event.data);
                    }, false);
                </script>
            </body>
        </html>
`;
    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                cols={50}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
            <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts" />
        </div>
    );
};

// sandbox="" ensures blocking a frame (child) with origin "null"
// from accessing a cross origin frame (parent)
// this works as a two way street
// sandbox="allow-same-origin" ensures access

ReactDOM.render(<App />, document.querySelector("#root"));
