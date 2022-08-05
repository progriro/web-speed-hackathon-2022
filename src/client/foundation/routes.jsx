import AsyncRoute from "preact-async-route";
// eslint-disable-next-line import/no-named-as-default
import Router from "preact-router";
import React from "react";

import { Top } from "./pages/Top";

/** @type {React.VFC} */
export const Routes = () => {
  const onChange = React.useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router onChange={onChange}>
      <Top path="/" />
      <Top path="/:date" />
      <AsyncRoute
        getComponent={() =>
          import("./pages/races/Race").then((module) => module.default)
        }
        path="/races/:raceId/odds"
      />
      <AsyncRoute
        getComponent={() =>
          import("./pages/races/Race").then((module) => module.default)
        }
        path="/races/:raceId/race-card"
      />
      <AsyncRoute
        getComponent={() =>
          import("./pages/races/Race").then((module) => module.default)
        }
        path="/races/:raceId/result"
      />
    </Router>
  );
};
