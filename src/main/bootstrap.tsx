import * as React from "react";
import { render } from "react-dom";
import Root from "./Root";
import { register } from "src/main/offline";

render(<Root />, document.getElementById("app"));
register();
