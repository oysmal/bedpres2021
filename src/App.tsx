import React from "react";
import "./App.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact={true} path="/room/:id" component={Room}/>
                <Route exact={true} path="/" component={Home}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
