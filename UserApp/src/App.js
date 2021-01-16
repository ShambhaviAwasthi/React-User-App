import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./components/Home";
import EachUserPost from "./components/EachUserPost";
import EachPost from "./components/EachPost";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/Home" component={Home} />
        <Route path="/user/:user_id" component={EachUserPost} />
        <Route path="/posts/:post_id" component={EachPost} />
      </BrowserRouter>
    );
  }
}

export default App;
