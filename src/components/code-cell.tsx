// we put the esbuild.wasm file in public to make it easy for the browser to fetch the file
import { useState } from "react";
import CodeEdtior from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
const CodeCell = () => {
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");

    const onClick = async () => {
        const output = await bundle(input);
        setCode(output);
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

export default CodeCell;
