"use strict"; //primary module that ties store actions with reducers

//redux modules
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
//react modules
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Import all Created react components that are associated with the router
//standard menu (non-authenticated) components
import Menu from './components/menu'
import Home from "./components/home";
import About from "./components/about";
import Signup from "./components/authentication/signup";
import Login from "./components/authentication/login";
//componets visible only after logged in
import Profile from "./components/authentication/profile";
import Books from "./components/books";
//import combined reducer to pass to store here
import reducers from "./reducers/index";

//use logger for debugging only
//const middleware = applyMiddleware(thunk,logger)
const middleware = applyMiddleware(thunk);
const store = createStore(reducers, middleware);

//decalre all routes of application below note that /profileadd,/passchange ,/mybooks actually
//do not have a link going to them , instead they are included in the routes for serving
//authneticating/authenticated actions
const Routes = (
  <Provider store={store}>
    <BrowserRouter>
      <Menu />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/profileadd" component={Profile} />
        <Route path="/passchange" component={Profile} />
        <Route path="/mybooks" component={Books} />
        <Route path="/about" component={About} />
      </Switch>
    </BrowserRouter>
  </Provider>
);
// render routes
render(Routes, document.getElementById("app"));
