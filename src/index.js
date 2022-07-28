import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// views without layouts

import Listing from "views/Listing.js";
import Product from "views/Product.js";
import Buy from "views/Buy.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import { IPFSContextProvider } from "./contexts/IPFS.js";

ReactDOM.render(
  <BrowserRouter>
    <IPFSContextProvider>
      <Switch>
        {/* add routes without layouts */}
        <Route path="/listing" exact component={Listing} />
        <Route path="/product" exact component={Product} />
        <Route path='/buy/:id' exact component={Buy} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/" exact component={Index} />
        {/* add redirect for first page */}
        <Redirect from="*" to="/" />
      </Switch>
    </IPFSContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
