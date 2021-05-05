import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/"><h1>Welcome to the workshop!</h1></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
