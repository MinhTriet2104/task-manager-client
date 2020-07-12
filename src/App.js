import React from "react";
import Dashboard from "./components/Dashboard";

function App({ history }) {
  return (
    <div className="App">
      <Dashboard history={history} />
    </div>
  );
}

export default App;
