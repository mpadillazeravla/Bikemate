//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

import "../styles/cards.css";
//import fonts
import "../styles/fonts.css";
//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
