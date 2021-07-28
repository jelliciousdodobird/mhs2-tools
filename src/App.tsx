// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Debug from "./components/Debug";

import { useThemeState } from "./contexts/ThemeContext";
// import ThemePreview from "./util/Themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import ProPage from "./pages/ProPage";
// import CrosshairCreator from "./pages/CrosshairCreator";
import NavigationBar from "./components/NavigationBar";
import { useUIState } from "./contexts/UIContext";
// import useRenderCount from "./hooks/useRenderCount";

// pages:
import MonstiesPage from "./pages/MonstiesPage";
import GenesPage from "./pages/GenesPage";
import TeamBuilderPage from "./pages/TeamBuilderPage";

const AppContainer = styled.div`
  /* border: 3px solid pink; */
  width: 100%;

  display: flex;
  flex-direction: row;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    flex-direction: column;
  }
`;

type SidebarPortalProps = {
  sidebarState: boolean;
};

const SidebarPortalLocation = styled(motion.div)<SidebarPortalProps>`
  /* border: 1px solid yellow; */
  position: relative;
  overflow: hidden;

  @media (max-width: 550px) {
    overflow-y: auto;
    ${({ theme, sidebarState }) =>
      sidebarState
        ? css`
            border-bottom: 1rem solid ${theme.colors.surface.main};
            border-top: 1rem solid ${theme.colors.surface.main};
          `
        : null}
  }
  background-color: ${({ theme }) => theme.colors.surface.main};
`;

const Spacing = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 1rem;
  min-height: 1rem;
  max-height: 1rem;
  background-color: red;
`;

const PageContainer = styled.div`
  /* border: 2px solid pink; */

  position: relative;

  scroll-behavior: smooth;

  overflow: auto;
  flex: 1;

  display: flex;
  flex-direction: column;

  /* border: 2px solid blue; */

  padding: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    padding: 1rem;
  }

  /* margin-left: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    margin-left: 0;
  } */
`;

const App = () => {
  // const renderCount = useRenderCount();
  const theme = useTheme();
  const {
    currentTheme,
    toggleTheme,
    changeCustomTheme,
    toggleThroughAllThemes,
  } = useThemeState();

  const { sidebarState, toggleSidebar, isMobile } = useUIState();

  const horizontalVariant = {
    open: {
      width: "20rem",
      height: "100%",

      // transition: {
      //   staggerChildren: 0.04,
      //   delayChildren: 0.1,
      // },
    },
    closed: {
      width: 0,
      height: "100%",

      // transition: {
      //   delay: 0.2,
      // },
    },
  };

  const verticalVariant = {
    open: {
      height: "20rem",
      width: "100%",

      // on mobile phones this animation lags presumably cus of the large scroll content
      // this is a way to "turn off" the animation
      // transition: { duration: 0 },

      // transition: {
      //   staggerChildren: 0.04,
      //   delayChildren: 0.1,
      // },
    },
    closed: {
      width: "100%",
      height: 0,

      // on mobile phones this animation lags presumably cus of the large scroll content
      // this is a way to "turn off" the animation
      // transition: { duration: 0 },

      // transition: {
      //   delay: 0.2,
      // },
    },
  };

  useEffect(() => {
    // console.log("App.tsx rendered", renderCount);
  });

  return (
    <AppContainer>
      <Helmet>
        <meta name="theme-color" content={theme.colors.background.main} />
      </Helmet>
      <BrowserRouter>
        <NavigationBar />
        {/* <SidebarPortalLocation
          id="sidebar-portal"
          variants={isMobile ? verticalVariant : horizontalVariant}
          initial={sidebarState ? "open" : "closed"}
          animate={sidebarState ? "open" : "closed"}
          sidebarState={sidebarState}
        >
        </SidebarPortalLocation> */}
        <PageContainer className="page-container" id="page-container">
          <Switch>
            <Route path="/monsties" component={MonstiesPage} />
            <Route path="/genes" component={GenesPage} />
            <Route path="/team-builder" component={TeamBuilderPage} />
          </Switch>
        </PageContainer>
      </BrowserRouter>
    </AppContainer>
  );
};

export default App;
