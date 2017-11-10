"use strict" //primary module that ties store actions with reducers

//redux modules
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
//react modules
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute,browserHistory} from 'react-router';

//Import all Created react components that are associated with the router
import Main from './main'
import Home from './components/home'
import About from './components/about'
import Signup from './components/signup'
import Login from './components/login'
import Profile from './components/profile'
import Books from './components/books'
//import combined reducer to pass to store here
import reducers from './reducers/index'

//use logger for debugging only
const middleware = applyMiddleware(thunk,logger)
//const middleware = applyMiddleware(thunk)
const store = createStore(reducers,middleware)

//decalre all routes of application below note that display actually does not have a link going to it , intested I included it in the routes for pulling up a specific poll with id
const Routes = (
<Provider store={store}>
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/>
      <Route path="/profileadd" component={Profile}/>
      <Route path="/passchange" component={Profile}/>
      <Route path="/mybooks" component={Books}/>
      <Route path="/about" component={About}/>
    </Route>
  </Router>
</Provider>
)
// render routes
render (Routes,document.getElementById('app'))
