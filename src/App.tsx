import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Rooms from "./pages/rooms/Rooms";
import Estimates from "./pages/estimates/Estimates";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/estimates/:id" component={Estimates} />
        <Route exact={true} path="/" component={Rooms} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
