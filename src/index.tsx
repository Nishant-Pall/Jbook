// we put the esbuild.wasm file in public to make it easy for the browser to fetch the file
import "bulmaswatch/slate/bulmaswatch.min.css";
import CodeCell from "./components/code-cell";
import ReactDOM from "react-dom";

const App = () => {
    return (
        <div>
            <CodeCell />
        </div>
    );
};

// sandbox="" ensures blocking a frame (child) with origin "null"
// from accessing a cross origin frame (parent)
// this works as a two way street
// sandbox="allow-same-origin" ensures access

ReactDOM.render(<App />, document.querySelector("#root"));
