// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import useTable, { ColumnProps, InputData } from "../hooks/useTable";
import MonstieCard from "./MonstieCard";

// icons:
import {
  BiCaretDownCircle,
  BiSearch,
  BiCaretRightCircle,
} from "react-icons/bi";
import { MdSort } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import { useEffect } from "react";
import PageContainerPortal from "./PageContainerPortal";
import TableSearchBar from "./TableSearchBar";
import { rgba } from "emotion-rgba";

const ELEMENT_COLOR = {
  non_elemental: "#949494",
  fire: "#fc6c6d",
  water: "#76befe",
  thunder: "#ffd76f",
  // ice: "#07ade6",
  ice: "#a8e9ff",
  dragon: "#d04fff",
  // dragon: "#991ec7",
  rainbow: "pink",
  "": "black",
};

type ElementType = keyof typeof ELEMENT_COLOR;

const Container = styled.div<{ searchPadding: boolean }>`
  position: relative;

  /* display: flex;
  flex-wrap: wrap; */

  display: grid;
  gap: 1rem;

  /* 18rem -> supports 280px devices */
  /* 21.5rem -> supports 280px devices */
  grid-template-columns: repeat(auto-fit, minmax(21.5rem, 1fr));

  padding-bottom: ${({ searchPadding }) => (searchPadding ? "5rem" : 0)};
`;

const FloatingPoint = styled(motion.div)`
  z-index: 10;

  margin-right: 0;

  position: sticky;
  top: 100%;
  left: 0;

  height: 0;
`;

const FAB = styled(motion.button)`
  z-index: 15;

  position: absolute;
  bottom: 0;
  right: 0;

  border-radius: 50%;
  width: 4rem;
  height: 4rem;

  background-color: ${({ theme }) => theme.colors.primary.main};

  box-shadow: 0px 0px 20px 0px ${({ theme }) => theme.colors.primary.main};
  box-shadow: 0px 0px 20px -10px black;
  /* background: ${({ theme }) =>
    `linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}; */

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: ${({ theme }) => theme.colors.onPrimary.main};
    }
  }

  /* @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    margin: 1rem;
  } */
`;

const SortButton = styled(FAB)`
  width: 3rem;
  height: 3rem;

  bottom: 5rem;
`;

const SearchBox = styled(motion.div)`
  overflow: hidden;

  z-index: 10;

  position: absolute;
  bottom: 0;
  right: 0;

  opacity: 0.94;
  backdrop-filter: blur(2px);

  background-color: ${({ theme }) => theme.colors.surface.main};
  box-shadow: 0px 0px 20px -13px black;

  border-radius: 5rem;

  width: 100%;
  height: 4rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
`;

const SortBoxHeader = styled.h5`
  position: sticky;
  top: 0;

  z-index: 10;

  background-color: ${({ theme }) => theme.colors.surface.main};

  padding: 1rem 0 0.5rem 0;

  color: ${({ theme }) => theme.colors.onSurface.main};
  font-weight: 700;

  /* font-size: 0.9rem; */

  /* margin-bottom: 0.5rem; */
`;

const SortBox = styled(SearchBox)`
  overflow: auto;

  padding: 1rem;
  padding-top: 0;
  /* margin: 1rem; */

  bottom: 4.5rem;
  border-radius: 1rem 1rem 2rem 1rem;
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.2);

  justify-content: flex-start;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const SortBtn = styled.button`
  white-space: nowrap;

  min-height: 1.75rem;
  width: 100%;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.primary.main};
  background-color: transparent;

  color: ${({ theme }) => theme.colors.onSurface.main};
  font-size: 0.85rem;

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
    /* position: absolute; */
    /* top: 0; */
    /* left: 0; */
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

const btnAnimationProps = {
  whileHover: {},
  whileTap: { scale: 0.75 },
};

const animationProps = {
  variants: {
    appear: { width: "100%" },
    exit: { width: "0%" },
  },
  initial: "exit",
  animate: "appear",
  exit: "exit",
};

const animationProps2 = {
  variants: {
    appear: { width: "15rem", height: "20rem" },
    exit: { width: "0rem", height: "0rem" },
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

type MonstieListProps = {
  data: InputData<unknown>[];
  column: ColumnProps[];
  defaultColumnWidth?: number;
};

const MonstieList = ({ data, column }: MonstieListProps) => {
  const {
    changeColumnOrder,
    toggleMultiSort,
    toggleSort,
    toggleShiftSort,
    columnAttrs,
    tableData,
    shiftHeld,
    sorts,
    filterData,
    toggleColumn,
    hiddenColumns,
  } = useTable(data, column, 150);
  const [showSort, setShowSort] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleShowSort = () => {
    setShowSearch(false);
    setShowSort((v) => !v);
  };
  const toggleShowSearch = () => {
    setShowSort(false);
    setShowSearch((v) => !v);
  };

  const theme = useTheme();

  const staticProps = {
    variants: {
      normal: { scale: 1, backgroundColor: theme.colors.primary.main },
      shrink: { scale: 0.75, backgroundColor: theme.colors.error.light },
    },
    initial: "normal",
    animate: showSearch ? "shrink" : "normal",
  };

  const staticProps2 = {
    variants: {
      normal: { x: "0rem", backgroundColor: theme.colors.primary.main },
      move: { x: "-0.5rem", backgroundColor: theme.colors.error.light },
    },
    initial: "normal",
    animate: showSort ? "move" : "normal",
  };

  // const containerRef = useRef<HTMLDivElement>(null);

  // const { width = containerRef.current?.getBoundingClientRect().width } =
  //   useResizeObserver({
  //     ref: containerRef,
  //   });

  // useEffect(() => {
  //   console.log("yo");
  // }, [width]);

  useEffect(() => {
    filterData(searchText);
  }, [searchText]);

  return (
    <>
      <FloatingPoint className="yooooo">
        <SortButton
          {...btnAnimationProps}
          onClick={toggleShowSort}
          {...staticProps2}
        >
          <MdSort />
        </SortButton>
        <FAB {...btnAnimationProps} onClick={toggleShowSearch} {...staticProps}>
          <BiSearch />
        </FAB>
        <AnimatePresence>
          {showSearch && (
            <SearchBox {...animationProps} key="search">
              <TableSearchBar
                value={searchText}
                onChange={(e: any) => setSearchText(e.target.value)}
                placeholderText="Filter monsties by name, egg color, ability, and more!"
              />
            </SearchBox>
          )}
          {showSort && (
            <SortBox {...animationProps2} key="sort">
              <SortBoxHeader>Sort</SortBoxHeader>
              {columnAttrs.map((col) => (
                <SortBtn
                  key={col.key}
                  type="button"
                  onClick={() => toggleShiftSort(col.key)}
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
                </SortBtn>
              ))}
            </SortBox>
          )}
        </AnimatePresence>
      </FloatingPoint>

      <Container
        searchPadding={showSearch}
        // ref={containerRef}
        onClick={() => {
          // console.log(tableData);
        }}
      >
        {tableData.map((monstie: any) => (
          <MonstieCard
            key={monstie.name + monstie.strength}
            monstie={monstie}
          />
        ))}
      </Container>
    </>
  );
};

export default MonstieList;
