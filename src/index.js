import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { createBrowserHistory } from "history";
import thunk from "redux-thunk";

import App from "./App";
import About from "./components/About";
import ChatBox from "./components/ChatBox/ChatBox";

import reducer from "./reducers/index";
import "./styles.scss";

// const history = createBrowserHistory();

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const IndexPage = () => {
  return (
    <div>
      Welcome to Task Manager
      <br />
      <a href="/project">Go to Projects</a>
    </div>
  );
};

const NotFoundPage = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <br />
      <a href="/project/5eeeffb55fc9ef2268b7c047">Return Homepage</a>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/about" component={About} />
        <Route path="/project" component={App} />
        <Route path="/chatbox" component={ChatBox} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
