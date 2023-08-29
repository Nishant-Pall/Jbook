import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount(count => count + 1);
  };

  return (
    <>
      <h1>JBOOK</h1>
      <div className="card">
        <button onClick={increaseCount}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
