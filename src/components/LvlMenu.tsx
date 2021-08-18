// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { SetStateAction, Dispatch } from "react";
import { AnimateSharedLayout, motion } from "framer-motion";

// styles:
import { popOutMenuBaseStyles } from "./ExpandSearchMenu";

const LevelBox = styled(motion.div)`
  ${popOutMenuBaseStyles}

  bottom: 4.5rem;
  right: 16rem;

  width: 4rem;
  height: 20rem;

  border-radius: 5rem;

  /* padding: 0.5rem 1rem; */
  padding: 1rem;

  /* justify-content: space-evenly; */
  align-items: center;
`;

const buttonSize = 2.5;

const LvlButton = styled(motion.button)`
  position: relative;

  border-radius: 50%;

  width: ${buttonSize}rem;
  height: ${buttonSize}rem;

  min-width: ${buttonSize}rem;
  min-height: ${buttonSize}rem;

  color: ${({ theme }) => theme.colors.onSurface.main};
  font-size: 0.9rem;
  font-weight: 600;

  background-color: transparent;
`;

const LvlRing = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;

  border: 3px solid ${({ theme }) => theme.colors.primary.main};
  background-color: transparent;
`;

const lvlAnimProps = {
  variants: {
    appear: {
      height: "auto",
      opacity: 0.94,
      transition: { delay: 0.2 },
    },
    exit: {
      height: "0rem",
      opacity: 0,
    },
  },
  initial: "exit",
  animate: "appear",
  exit: "exit",

  transition: {
    type: "spring",
    stiffness: 500,
    damping: 30,
  },
};

const LEVELS = [1, 10, 20, 30, 40, 50, 75, 99];

type LvlMenuProps = {
  lvl: number;
  setLvl: Dispatch<SetStateAction<number>>;
};

const LvlMenu = ({ lvl, setLvl }: LvlMenuProps) => {
  return (
    <LevelBox {...lvlAnimProps} key="lvl-select">
      <AnimateSharedLayout>
        {LEVELS.map((l) => (
          <LvlButton key={l} onClick={() => setLvl(l)}>
            {l}
            {lvl === l && (
              <LvlRing
                layoutId="lvl-select-ring"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </LvlButton>
        ))}
      </AnimateSharedLayout>
    </LevelBox>
  );
};

export default LvlMenu;
