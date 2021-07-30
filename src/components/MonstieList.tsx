// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { useState, useEffect, useRef, ReactElement } from "react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";

// custom hooks:
import useTable, { ColumnProps, InputData } from "../hooks/useTable";

// custom components:
import MonstieCard from "./MonstieCard";
import SortMenu from "./ExpandSortMenu";
import ExpandSearchMenu from "./ExpandSearchMenu";

// icons:
import { BiSearch } from "react-icons/bi";
import { MdSort } from "react-icons/md";

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
`;

const SortButton = styled(FAB)`
  width: 3rem;
  height: 3rem;

  bottom: 5rem;
`;

const btnAnimationProps = {
  whileHover: {},
  whileTap: { scale: 0.75 },
};

type MonstieListProps = {
  data: InputData<unknown>[];
  column: ColumnProps[];
  defaultColumnWidth?: number;
};

const ShuffleAnimationWrapper = ({
  animationOn,
  children,
}: {
  animationOn: boolean;
  children: ReactElement;
}) => {
  if (animationOn) return <AnimateSharedLayout>{children}</AnimateSharedLayout>;
  else return <>{children}</>;
};

const Div = styled.div``;

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

  const setSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

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

  useEffect(() => {
    filterData(searchText);
  }, [searchText]);

  return (
    <>
      <FloatingPoint className="yooooo">
        <SortButton
          {...btnAnimationProps}
          {...staticProps2}
          onClick={toggleShowSort}
        >
          <MdSort />
        </SortButton>
        <FAB {...btnAnimationProps} {...staticProps} onClick={toggleShowSearch}>
          <BiSearch />
        </FAB>
        <AnimatePresence>
          {showSearch && (
            <ExpandSearchMenu
              value={searchText}
              onChange={setSearch}
              key="search"
            />
          )}
          {showSort && (
            <SortMenu
              key="sort-menu"
              columnAttrs={columnAttrs}
              toggleShiftSort={toggleShiftSort}
            />
          )}
        </AnimatePresence>
      </FloatingPoint>

      <Container
        searchPadding={showSearch}
        onClick={() => {
          // console.log(tableData);
        }}
      >
        <AnimateSharedLayout>
          {tableData.map((monstie: any) => (
            <MonstieCard
              key={monstie.name + monstie.strength}
              monstie={monstie}
            />
          ))}
        </AnimateSharedLayout>
      </Container>
    </>
  );
};

export default MonstieList;
