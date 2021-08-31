// we put the esbuild.wasm file in public to make it easy for the browser to fetch the file
import "bulmaswatch/slate/bulmaswatch.min.css";
import { useState } from "react";
import ReactDOM from "react-dom";
import CodeEdtior from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

const App = () => {
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

ReactDOM.render(<App />, document.querySelector("#root"));
