import resetCss from "modern-css-reset?raw";
import { createGlobalStyle } from "styled-components";

import { Color } from "./variables";

export const GlobalStyle = createGlobalStyle`
 ${resetCss}

  body {
    color: ${Color.mono[900]};
    background: ${Color.mono[100]};
    font-family: sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    padding: 0;
    list-style: none;
    margin: 0;
  }

  @font-face {
    font-family: "Senobi-Gothic";
    font-weight: bold;
    font-display: swap;
    src: url("/assets/fonts/Senobi-Gothic-Bold.woff2") format("truetype");
  }
`;
