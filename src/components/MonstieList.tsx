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
import FloatingPoint from "./FloatingPoint";
import Portal from "./DynamicPortal";
import FloatingActionButton from "./FloatingActionButton";

const Container = styled.div<{ searchPadding: boolean }>`
  position: relative;

  /* display: flex;
  flex-wrap: wrap; */

  display: grid;
  gap: 1rem;

  /* 18rem -> supports 280px devices */
  /* 21.5rem -> supports 280px devices */
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));

  padding-bottom: ${({ searchPadding }) => (searchPadding ? "6rem" : 0)};
`;

// const FloatingPoint = styled(motion.div)`
//   z-index: 10;

//   position: sticky;
//   top: 100%;
//   left: 0;

//   height: 0;
// `;

const SearchFAB = styled(FloatingActionButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const SortFAB = styled(FloatingActionButton)`
  position: absolute;
  bottom: 5rem;
  right: 0;
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
  const [eggMode, setEggMode] = useState(false);

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
      <Portal portalId="floating-point-monstie-list">
        <SortFAB
          size="m"
          {...btnAnimationProps}
          {...staticProps2}
          onClick={toggleShowSort}
        >
          <MdSort />
        </SortFAB>

        <SearchFAB size="l" {...staticProps} onClick={toggleShowSearch}>
          <BiSearch />
        </SearchFAB>
        <AnimatePresence>
          {showSearch && (
            <ExpandSearchMenu
              key="search"
              value={searchText}
              onChange={setSearch}
              placeholderText="Filter monsties by name, egg color, ability, and more!"
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
      </Portal>

      <Container
        searchPadding={showSearch}
        onClick={() => setEggMode((v) => !v)}
      >
        <AnimateSharedLayout>
          {tableData.map((monstie: any) => (
            <MonstieCard
              key={monstie.name + monstie.strength}
              monstie={monstie}
              showEgg={eggMode}
            />
          ))}
        </AnimateSharedLayout>
      </Container>
    </>
  );
};

export default MonstieList;
