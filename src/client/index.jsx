import React from "react";
import ReactDOM from "react-dom";

import { App } from "./foundation/App";

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

requestIdleCallback(() => {
  const $font = document.createElement("link");
  $font.rel = "stylesheet";
  $font.href = "/assets/fonts/Senobi-Gothic-Bold.woff2";
  $font.type = "font/woff2";
  $font.as = "font";
  document.head.append($font);
});
