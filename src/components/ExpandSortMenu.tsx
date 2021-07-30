// styling:
import { css, jsx, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { AnimateSharedLayout, motion } from "framer-motion";

// types:
import { Column } from "../hooks/useTable";

// icons:
import { BiCaretRightCircle } from "react-icons/bi";
import { MdSort } from "react-icons/md";

// styles:
import { popOutMenuBaseStyles } from "./ExpandSearchMenu";
import { useState } from "react";
import { ELEMENT_COLOR } from "../utils/ProjectTypes";

const SortBox = styled(motion.div)`
  ${popOutMenuBaseStyles}

  overflow-y: auto;
  overflow-x: hidden;

  padding: 1rem;
  padding-top: 0;

  bottom: 4.5rem;
  border-radius: 1rem 1rem 2rem 1rem;
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.2);

  justify-content: flex-start;

  /* HIDE SCROLL BARS BUT STILL SCROLLABLE */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const SortBoxHeader = styled.h5`
  z-index: 10;

  position: sticky;
  top: 0;

  background-color: ${({ theme }) => theme.colors.surface.main};

  padding: 1rem 0 0.5rem 0;

  color: ${({ theme }) => theme.colors.onSurface.main};
  font-weight: 700;
  font-size: 1.1rem;

  display: flex;
  /* justify-content: center; */
  align-items: center;

  svg {
    margin-left: 0.5rem;
    width: 1.28rem;
    height: 1.28rem;

    path {
      fill: ${({ theme }) => theme.colors.onSurface.main};
    }
  }
`;

const SortBtn = styled(motion.button)`
  position: relative;

  white-space: nowrap;

  min-height: 1.75rem;
  width: 100%;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.primary.main};
  background-color: transparent;

  color: ${({ theme }) => theme.colors.onSurface.main};
  font-size: 0.82rem;

  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

const indicatorIconSize = 16;

const SortIndicator = styled(motion.span)<{ orderType: string }>`
  width: ${indicatorIconSize}px;
  height: ${indicatorIconSize}px;
  min-width: ${indicatorIconSize}px;
  min-height: ${indicatorIconSize}px;
  max-width: ${indicatorIconSize}px;
  max-height: ${indicatorIconSize}px;
  margin-right: 0.5rem;

  svg {
    width: ${indicatorIconSize}px;
    height: ${indicatorIconSize}px;

    path {
      transition: 100ms fill linear;
      fill: ${({ orderType, theme }) => {
        if (orderType === "ascend") return theme.colors.correct.main;
        else if (orderType === "descend") return theme.colors.error.main;
        else return rgba(theme.colors.onBackground.main, 0.2);
      }};
    }
  }
`;
const HoverIndicator = styled(motion.span)`
  position: absolute;

  margin: auto 0;
  top: calc(50% - (1rem / 2));

  left: -20px;

  width: 2px;
  height: 1rem;
  /* border-radius: 0 50% 50% 0; */
  margin-left: 0.5rem;
  background-color: ${({ theme }) => theme.colors.error.light};
`;
const LevelBox = styled(SortBox)`
  bottom: 4.5rem;

  right: 16rem;

  /* padding: 1rem; */
  width: 4rem;
  height: 20rem;

  border-radius: 1rem;
  border-radius: 5rem;

  padding: 1rem;

  /* background-color: red; */

  justify-content: space-evenly;
  align-items: center;
`;

const LB = styled(motion.button)`
  /* background-color: red; */

  border-radius: 50%;

  width: 2rem;
  height: 2rem;

  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-size: 0.9rem;
  font-weight: 600;

  background-image: ${({ theme }) =>
    `linear-gradient(

      ${ELEMENT_COLOR["thunder"].main} 75%, 

      ${ELEMENT_COLOR["fire"].main} 85%)
  `};
  background-attachment: fixed;

  /* background-size: 25rem 100%; */
`;

const fullOpacity = 0.94;

const sortAnimProps = {
  variants: {
    appear: { width: "15rem", height: "20rem", opacity: fullOpacity },
    exit: {
      width: "0rem",
      height: "0rem",
      opacity: 0,
      transition: { delay: 0.2 },
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

const lvlAnimProps = {
  variants: {
    appear: {
      // width: "5rem",
      height: "20rem",
      opacity: fullOpacity,
      transition: { delay: 0.2 },
    },
    exit: {
      // width: "0rem",

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

const itemAnimProps = {
  variants: {
    appear: (i: number) => ({
      // width: "5rem",
      x: 0,
      opacity: 1,

      transition: {
        delay: 0.2 + 0.03 * i,
        duration: 0.2,
      },
    }),
    exit: (i: number) => ({
      // width: "0rem",

      x: "50%",
      opacity: 0,

      transition: { delay: 0.03 * i, duration: 0.2 },
    }),
  },
  initial: "exit",
  animate: "appear",
  exit: "exit",
};

const sortIndicatorVariant = {
  none: {
    rotate: 0,
    scale: 1,
    // rotate: [180, 360, 360, 360],
    // scale: [1, 1, 0, 0],
  },
  descend: {
    rotate: 90,
    scale: 1,
  },
  ascend: {
    rotate: 280,
    scale: 1,
  },
};

type SortMenuProps = {
  columnAttrs: Column[];
  toggleShiftSort: (key: string) => void;
};

const levels = [1, 10, 20, 30, 40, 50, 75, 99];

const SortMenu = ({ columnAttrs, toggleShiftSort }: SortMenuProps) => {
  const [hover, setHover] = useState("");

  return (
    <>
      <LevelBox {...lvlAnimProps}>
        {levels.map((lvl) => (
          <LB key={lvl}>{lvl}</LB>
        ))}
      </LevelBox>
      <SortBox {...sortAnimProps}>
        <SortBoxHeader>
          Sort <MdSort />
        </SortBoxHeader>
        <AnimateSharedLayout>
          {columnAttrs.map((col, i) => (
            <SortBtn
              key={col.key}
              type="button"
              onClick={() => toggleShiftSort(col.key)}
              onMouseEnter={() => setHover(col.key)}
              custom={i}
              {...itemAnimProps}
            >
              <SortIndicator
                orderType={col.sorted}
                variants={sortIndicatorVariant}
                initial={false}
                animate={col.sorted}
              >
                <BiCaretRightCircle />
              </SortIndicator>
              {col.label}

              {hover === col.key && (
                <HoverIndicator
                  layoutId="sort-hover"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </SortBtn>
          ))}
        </AnimateSharedLayout>
      </SortBox>
    </>
  );
};

export default SortMenu;
