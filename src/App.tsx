// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { Switch, Route, Redirect, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useEffect, useState } from "react";

// custom components:
import NavigationBar from "./components/NavigationBar";
import Debug from "./components/Debug";

// pages:
import MonstiesPage from "./pages/MonstiesPage";
import GenesPage from "./pages/GenesPage";
import TeamBuilderPage from "./pages/TeamBuilderPage";
import BuildPage from "./pages/BuildPage";

const AppContainer = styled.div`
  /* border: 2px dashed lightblue; */

  position: relative;
  width: 100%;

  display: flex;
  flex-direction: row;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    flex-direction: column;
  }
`;

const PageContainer = styled.main`
  /* border: 2px dashed pink; */

  z-index: 1;
  position: relative;
  /* scroll-behavior: smooth; */

  flex: 1;

  display: flex;
  flex-direction: column;

  padding: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    padding: 0.75rem;
  }
`;

const App = () => {
  const theme = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    // When we change routes (clicking a link to go on another page),
    // the scroll position does NOT get reset because the scroll bar
    // is on the html element (which is outside of this component).
    // Therefore we need to reset the scroll position manually every time
    // the pathname changes (this excludes #links which is ideal).
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AppContainer id="app">
      <Helmet>
        <meta name="theme-color" content={theme.colors.background.main} />
      </Helmet>
      <NavigationBar />
      <PageContainer className="page-container" id="page-container">
        <Switch>
          <Route path="/monsties" component={MonstiesPage} />
          <Route path="/genes" component={GenesPage} />
          <Route exact path="/builds" component={TeamBuilderPage} />
          {/* <Route exact path="/builds/:id" component={} /> */}
          <Route path="/builds/edit/:id" component={BuildPage} />
        </Switch>
      </PageContainer>
    </AppContainer>
  );
};

export default App;
