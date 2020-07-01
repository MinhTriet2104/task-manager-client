import React from "react";
import Dashboard from "./components/Dashboard";

function App({ match }) {
  return (
    <div className="App">
      <Dashboard match={match} />
    </div>
  );
}

export default App;
