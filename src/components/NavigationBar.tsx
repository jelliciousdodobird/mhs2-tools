// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { createElement, ReactElement, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";
import { rainbowTextGradient } from "../pages/BuildPage";

// icons:
import { CgMenu } from "react-icons/cg";
import { MdClose } from "react-icons/md";

// custom components:
import Debug from "./Debug";

// custom hooks:
import { useThemeState } from "../contexts/ThemeContext";
import { useUIState } from "../contexts/UIContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { GUTTER } from "./Gutter";

// background: ${({ theme }) =>
//   `linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`};
const NavbarContainer = styled(motion.nav)`
  z-index: 2;

  position: sticky;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ theme }) => css`
    height: ${theme.dimensions.mainNav.maxHeight}px;
    max-height: ${theme.dimensions.mainNav.maxHeight}px;
    min-height: ${theme.dimensions.mainNav.maxHeight}px;
  `}

  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

const MainNav = styled(motion.ul)`
  display: flex;
  flex-direction: row;

  ${GUTTER}

  width: 100%;
  height: 100%;

  &::after {
    z-index: 5;

    position: absolute;
    top: 0;
    left: 0;

    content: "";

    width: 100%;
    height: 100%;

    background-color: ${({ theme }) => rgba(theme.colors.surface.main, 0.97)};
    backdrop-filter: blur(2px);
  }
`;

const LogoLI = styled.li`
  z-index: 10;
  position: relative;

  flex: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuButtonLI = styled.li`
  z-index: 10;
  position: relative;

  flex: 1;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LinkNavLI = styled(motion.li)`
  z-index: 10;

  position: relative;
  /* border: 2px dashed red; */

  background-color: transparent;

  flex: 1;

  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    z-index: 0; // move LinkNavLI BELOW background (::after element on MainNav)

    background-color: ${({ theme }) => theme.colors.surface.main};

    flex-direction: column;
    gap: 0;

    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    position: absolute;
    top: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;
    left: 0;
  }
`;

const ListContainer = styled.ul`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    gap: 0;

    width: 100%;

    height: min-content;
    background-color: inherit;
  }
`;

const NavItemContainer = styled(motion.li)`
  position: relative;
  cursor: pointer;

  height: 3rem;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    a {
      p {
        /* text-decoration: underline; */
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    width: 100%;
    padding: 0 2rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.light};
    }
  }
`;

const MotionLink = styled(motion(Link))`
  position: relative;

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
        fill: ${({ theme }) => theme.colors.onSurface.main};
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    align-items: flex-start;
  }
`;

const P = styled(motion.p)`
  white-space: nowrap;
  font-size: 0.85rem;
  font-weight: 600;

  /* font-style: italic; */
`;

const Marker = styled(motion.div)`
  position: absolute;
  bottom: 8px;

  width: 100%;
  height: 4px;
  border-radius: 3px;

  background-color: ${({ theme }) => theme.colors.primary.main};

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    top: 41%;
    left: -1rem;

    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
`;

type NewNavItemProps = {
  to: string;
  text?: string;
  icon?: IconType;
  iconSize?: number;
  small?: boolean;
  className?: string;
  onClick?: () => void;
  iconAnimationProps?: object;
  showMarker?: boolean;
  children?: ReactElement;
};

const NavLink = ({
  to = "#",
  text,
  icon,
  small = false,
  iconSize = 20,
  className,
  iconAnimationProps,
  showMarker = true,
  onClick = () => {},
  children,
}: NewNavItemProps) => {
  // const Container = small ? NavItemContainerSmall : NavItemContainer;
  // const Inner = to === "#" ? NavButton : NavLink;
  const location = useLocation();
  const selected = location.pathname.includes(to);

  return (
    <NavItemContainer className={className}>
      <MotionLink to={to} onClick={onClick}>
        {selected && <Marker layoutId="link-marker" />}
        {icon && (
          <motion.span {...iconAnimationProps}>
            {createElement(icon)}
          </motion.span>
        )}
        {text && <P>{text}</P>}
      </MotionLink>
    </NavItemContainer>
  );
};

const t = 24;

const MenuButton = styled.button`
  /* margin-left: auto; */

  width: 3rem;
  height: 3rem;
  /* border: 1px solid; */

  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: ${t}px;
    height: ${t}px;
    path {
    }
  }
`;

const NavigationBar = () => {
  const { isMobile } = useUIState();
  const [mainNav, setMainNav] = useState(false);
  const { selectedTheme, toggleTheme } = useThemeState();
  const themeToggle = selectedTheme === "dark" ? true : false;
  const showMainNav = mainNav ? true : !isMobile;

  const mainNavAnimationProps = {
    variants: {
      open: { y: 0 },
      closed: {
        y: -450,
      },
    },
    initial: "closed",
    animate: showMainNav ? "open" : "closed",
    exit: "closed",
    transition: { duration: 0.25 },
    // transition: { velocity: 500 },
  };

  const toggleMainNav = () => setMainNav((val) => !val);

  const closeSidebarToggleMainNav = () => {
    // setSidebarState(false);
    toggleMainNav();
  };

  const closeMainNavToggleSidebar = () => {
    setMainNav(false);
    // toggleSidebar();
  };

  const closeMainNav = () => setMainNav(false);

  return (
    <NavbarContainer>
      <MainNav>
        {/* ITEM 1 (LOGO) */}
        <LogoLI>
          <Logo />
        </LogoLI>

        {/* ITEM 2 (ACTUAL NAV ITEMS) */}
        <AnimateSharedLayout>
          <AnimatePresence>
            {showMainNav && (
              <LinkNavLI {...mainNavAnimationProps}>
                <ListContainer>
                  <NavLink
                    text="Monsties"
                    // icon={GiBrute}
                    to="/monsties"
                    iconSize={18}
                    onClick={closeMainNav}
                    // iconAnimation={crossHairAnimationProps}
                  />
                  <NavLink
                    text="Genes"
                    // icon={BiDna}
                    to="/genes"
                    iconSize={18}
                    onClick={closeMainNav}
                  />
                  <NavLink
                    text="Team Builder"
                    // icon={MdBuild}
                    to="/builds"
                    iconSize={18}
                    onClick={closeMainNav}
                  />
                </ListContainer>{" "}
                <ListContainer>
                  <NavLink
                    text="Account"
                    // icon={MdBuild}
                    to="/account"
                    // iconSize={18}
                    onClick={closeMainNav}
                  />
                  <NavLink
                    text="Contribute"
                    // icon={MdBuild}
                    to="/contribute"
                    // iconSize={18}
                    onClick={closeMainNav}
                  />

                  {/* <NavItem> */}
                  <NavItemContainer>
                    {isMobile && <P>Theme</P>}
                    <ThemeToggle />
                  </NavItemContainer>

                  {/* </NavItem> */}
                </ListContainer>
              </LinkNavLI>
            )}
          </AnimatePresence>
        </AnimateSharedLayout>

        {/* ITEM 3 (Menu button for mobile mode) */}
        {isMobile && (
          <MenuButtonLI>
            <MenuButton type="button" onClick={closeSidebarToggleMainNav}>
              {mainNav ? <MdClose /> : <CgMenu />}
            </MenuButton>
          </MenuButtonLI>
        )}
      </MainNav>
    </NavbarContainer>
  );
};
export default NavigationBar;
