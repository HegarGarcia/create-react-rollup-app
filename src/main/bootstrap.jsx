import React from "react";
import { render } from "react-dom";
import Root from "./Root";
import { register } from "./offline/offline";

render(<Root />, document.getElementById("app"));
register();
