// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeState } from "../contexts/ThemeContext";

import { MdBrightnessHigh, MdBrightness4 } from "react-icons/md";

const Container = styled.button`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.main};
  /* width: 5rem; */
  /* padding: 0 0.75rem; */
  height: 2rem;
  width: 2rem;
  /* border: 1px dashed red; */

  border-radius: 5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.3rem;
    height: 1.3rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};

    svg {
      path {
        fill: ${({ theme }) => theme.colors.onPrimary.main};
      }
    }
  }
`;

type ThemeToggleProps = {};

const ThemeToggle = ({}: ThemeToggleProps) => {
  const { toggleTheme, selectedTheme } = useThemeState();
  const themeToggle = selectedTheme === "dark";
  return (
    <Container type="button" onClick={toggleTheme}>
      {themeToggle ? <MdBrightness4 /> : <MdBrightnessHigh />}
    </Container>
  );
};

export default ThemeToggle;
