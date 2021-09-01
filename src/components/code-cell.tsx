import { useState } from "react";
import CodeEdtior from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";
const CodeCell = () => {
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");

    const onClick = async () => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <Resizable direction="vertical">
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <CodeEdtior
                    initialValue="const a = 1"
                    onChange={(value) => setInput(value)}
                />
                <Preview code={code} />
            </div>
        </Resizable>
    );
};

// sandbox="" ensures blocking a frame (child) with origin "null"
// from accessing a cross origin frame (parent)
// this works as a two way street
// sandbox="allow-same-origin" ensures access

export default CodeCell;
