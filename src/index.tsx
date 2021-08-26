// we put the esbuild.wasm file in public to make it easy for the browser to fetch the file
import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
    const ref = useRef<any>();
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");

    const startService = async () => {
        // initialization of esbuild-wasm
        // and get reference to service from esbuild
        ref.current = await esbuild.startService({
            // to fetch compiled esbuild.wasm binary from public dir
            worker: true,
            wasmURL: "/esbuild.wasm",
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
            //  unpkgPathPlugin as a plugin
            plugins: [unpkgPathPlugin()],
        });
        setCode(result.outputFiles[0].text);

        // transform function is for handling transpiling only
        // const result = await ref.current.transform(input, {
        //     loader: "jsx",
        //     target: "es2015",
        // });
        // setCode(result.code);
    };

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector("#root"));
