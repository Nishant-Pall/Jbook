import { useState } from "react";
import Editor from "./Editor";
import "./App.css";
import "./Editor";

function App() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount((count) => count + 1);
  };

  return (
    <>
      <h1>JBOOK</h1>
      <div className="card">
        <div>
          <Editor />
        </div>
        <button onClick={increaseCount}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
