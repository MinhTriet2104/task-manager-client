import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";

import App from "./App";
import About from "./components/About";

import reducer from "./reducers/index";
import "./styles.css";

const history = createBrowserHistory();

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
      <a href="/project/5eeeffb55fc9ef2268b7c047">Homepage</a>
    </div>
  );
};

const NotFoundPage = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <br />
      <a href="/project/5eeeffb55fc9ef2268b7c047">Homepage</a>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/project/:id" exact component={App} />
        <Route path="/about" exact component={About} />
        <Route path="/" exact component={IndexPage} />
        <Route path="*" exact component={NotFoundPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
