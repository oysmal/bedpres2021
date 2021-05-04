import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">Welcome to the workshop!</Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
