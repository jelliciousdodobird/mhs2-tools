// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { motion, AnimatePresence } from "framer-motion";
import { createElement, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

// icons:
import {
  MdBrightnessHigh,
  MdBrightness4,
  MdDetails,
  MdLastPage,
  MdMap,
  MdPeople,
  MdBuild,
  MdStar,
} from "react-icons/md";

import { GiBrute } from "react-icons/gi";

import { FaCrown } from "react-icons/fa";
import { CgMenu } from "react-icons/cg";
import { BiCrosshair, BiDna } from "react-icons/bi";

// custom components:
import Debug from "./Debug";

// custom hooks:
import { useThemeState } from "../contexts/ThemeContext";
import { useUIState } from "../contexts/UIContext";

const NavbarContainer = styled(motion.nav)`
  position: relative;
  z-index: 200;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    flex-direction: column-reverse;

    ${({ theme }) => css`
      height: ${theme.dimensions.mainNav.maxHeight}px;
      max-height: ${theme.dimensions.mainNav.maxHeight}px;
      min-height: ${theme.dimensions.mainNav.maxHeight}px;
    `}

    width: 100%;
    padding: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.m + 1}px) {
    flex-direction: column;

    ${({ theme }) => css`
      width: ${theme.dimensions.mainNav.maxWidth}px;
      max-width: ${theme.dimensions.mainNav.maxWidth}px;
      min-width: ${theme.dimensions.mainNav.maxWidth}px;
    `}

    height: 100%;
    padding: 0.5rem 0;
  }
`;

const MainNav = styled(motion.ul)`
  position: relative;
  z-index: -100;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    background-color: ${({ theme }) => theme.colors.surface.main};
    position: absolute;
    top: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;
    left: 0;

    width: 100%;
  }
`;

const SubNav = styled.ul`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    flex-direction: row;
    width: 100%;
    background-color: inherit;
  }
`;

const navItemBaseStyles = ({ theme }: { theme: Theme }) => css`
  cursor: pointer;
  overflow: hidden;

  a,
  button {
    background-color: transparent;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      svg {
        height: 100%;
        width: 100%;

        path,
        line {
          fill: ${theme.colors.onBackground.main};
        }
      }
    }
  }

  &:hover {
    background-color: ${theme.colors.background.light};
  }
`;

const NavItemContainer = styled(motion.li)`
  ${navItemBaseStyles}

  border-radius: 3px;

  width: ${({ theme }) => theme.dimensions.mainNav.maxWidth - 20}px;
  height: ${({ theme }) => theme.dimensions.mainNav.maxWidth - 20}px;

  a,
  button {
    span {
      width: ${({ iconSize }: { iconSize: number }) => iconSize * 1.6}px;
      height: ${({ iconSize }: { iconSize: number }) => iconSize * 1.6}px;
    }

    p {
      width: 100%;
      font-size: 12px;
      color: ${({ theme }) => theme.colors.onBackground.main};

      margin-top: 8px;

      display: flex;
      justify-content: center;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    width: 100%;
    height: 50px;

    a,
    button {
      flex-direction: row;
      justify-content: flex-start;
      overflow: visible;
      padding: 0 1.75rem;

      span {
        margin-right: 1rem;
        ${({ iconSize }) =>
          css`
            width: ${iconSize + 5}px;
            height: ${iconSize + 5}px;
          `}
      }
      p {
        justify-content: flex-start;
        font-size: 1rem;
        margin-top: 0;
      }
    }
  }
`;

const NavItemContainerSmall = styled(motion.li)`
  ${navItemBaseStyles}

  border-radius: 6px;

  width: 3rem;
  height: 3rem;

  a,
  button {
    span {
      width: ${({ iconSize }: { iconSize: number }) => iconSize}px;
      height: ${({ iconSize }: { iconSize: number }) => iconSize}px;
    }
  }
`;

const NavLink = styled(motion(Link))``;
const NavButton = styled(motion.button)``;
const P = styled(motion.p)`
  /* margin-top: 8px; */
`;

type NewNavItemProps = {
  to?: string;
  text?: string;
  icon?: IconType;
  iconSize?: number;
  small?: boolean;
  className?: string;
  onClick?: () => void;
  iconAnimationProps?: object;
};

const NavItem = ({
  to = "#",
  text,
  icon,
  small = false,
  iconSize = 20,
  className,
  iconAnimationProps,
  onClick = () => {},
}: NewNavItemProps) => {
  const Container = small ? NavItemContainerSmall : NavItemContainer;
  const Inner = to === "#" ? NavButton : NavLink;

  return (
    <Container iconSize={iconSize} className={className}>
      <Inner to={to} onClick={onClick}>
        {icon && (
          <motion.span {...iconAnimationProps}>
            {createElement(icon)}
          </motion.span>
        )}
        {text && <P>{text}</P>}
      </Inner>
    </Container>
  );
};

const Logo = styled(NavItem)`
  button,
  a {
    span {
      position: relative;
      transform-origin: center 39%;
      width: 5rem;
      height: 5rem;
      svg {
        path {
          fill: ${({ theme }) => theme.colors.primary.main};
        }
      }
    }

    /* span::after {
    content: "";
    position: absolute;
    top: 37.5%;
    left: 50%;
    background-color: red;
    width: 1px;
    height: 1px;
  } */
  }
`;

const MenuButton = styled(NavItem)`
  margin-right: auto;
`;

const NavigationBar = () => {
  const theme = useTheme();
  const { isMobile, toggleSidebar, setSidebarState, sidebarState } =
    useUIState();
  const [mainNav, setMainNav] = useState(false);
  const { selectedTheme, toggleTheme } = useThemeState();
  const themeToggle = selectedTheme === "dark" ? true : false;
  const showMainNav = mainNav ? true : !isMobile;

  const navBarColorAnimationProps = {
    variants: {
      open: {
        backgroundColor: theme.colors.background.main,
      },
      closed: {
        backgroundColor: theme.colors.surface.main,
      },
    },
    initial: sidebarState ? "open" : "closed",
    animate: sidebarState ? "open" : "closed",
  };

  const sidebarButtonAnimationProps = {
    variants: {
      open: { rotate: 180 + (isMobile ? 90 : 0) },
      closed: { rotate: 0 + (isMobile ? 90 : 0) },
    },
    initial: sidebarState ? "open" : "closed",
    animate: sidebarState ? "open" : "closed",
  };

  const mainNavAnimationProps = {
    variants: {
      open: { y: 0 },
      closed: {
        y: -300,
      },
    },
    initial: "closed",
    animate: showMainNav ? "open" : "closed",
    exit: "closed",
    transition: { duration: 0.25 },
    // transition: { velocity: 500 },
  };

  const crossHairAnimationProps = {
    whileHover: {
      x: [0, 20, -20, 40, -50, 0, 0, 0, 0, 0, 0, 0],
      y: [0, 0, 50, 20, -20, 0, 0, 0, 0, 0, 0, 0],
      scale: [1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.8, 0.5, 0.8, 0.5, 0.8, 0.5, 1],

      // rotate: [0, 0, 270, 270, 0],
      // borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      transition: {
        duration: 2,
        ease: "easeInOut",
        // times: [0.3, 0.3, 0.3, 0.3, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1],
        loop: Infinity,
        repeatDelay: 1,
      },
    },
  };

  const logoAnimationProps = {
    whileHover: {
      // originX: 0.5,
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",

        loop: Infinity,
      },
    },
  };

  const toggleMainNav = () => setMainNav((val) => !val);
  const closeSidebarToggleMainNav = () => {
    setSidebarState(false);
    toggleMainNav();
  };

  const closeMainNavToggleSidebar = () => {
    setMainNav(false);
    toggleSidebar();
  };

  const closeMainNav = () => setMainNav(false);

  return (
    <NavbarContainer {...navBarColorAnimationProps}>
      <AnimatePresence>
        {showMainNav && (
          <MainNav {...mainNavAnimationProps}>
            {!isMobile && (
              <Logo
                to="/"
                icon={MdDetails}
                // iconAnimation={logoAnimationProps}
              />
            )}
            <NavItem
              text="Monsties"
              icon={GiBrute}
              to="/monsties"
              iconSize={18}
              onClick={closeMainNav}
              // iconAnimation={crossHairAnimationProps}
            />
            <NavItem
              text="Genes"
              icon={BiDna}
              to="/genes"
              iconSize={18}
              onClick={closeMainNav}
            />
            <NavItem
              text="Team Builder"
              icon={MdBuild}
              to="/team-builder"
              iconSize={18}
              onClick={closeMainNav}
            />
            {/* <NavItem
              text="Pros"
              icon={FaCrown}
              to="/pros"
              onClick={closeMainNav}
            />
            <NavItem
              text="Community"
              icon={MdPeople}
              to="/community"
              onClick={closeMainNav}
            /> */}
          </MainNav>
        )}
      </AnimatePresence>
      <SubNav>
        {isMobile && (
          <MenuButton
            small
            icon={CgMenu}
            iconSize={23}
            onClick={closeSidebarToggleMainNav}
          />
        )}

        <NavItem
          small
          onClick={toggleTheme}
          icon={themeToggle ? MdBrightnessHigh : MdBrightness4}
        />
        <NavItem
          small
          onClick={closeMainNavToggleSidebar}
          icon={MdLastPage}
          iconAnimationProps={sidebarButtonAnimationProps}
        />
      </SubNav>
    </NavbarContainer>
  );
};
export default NavigationBar;
