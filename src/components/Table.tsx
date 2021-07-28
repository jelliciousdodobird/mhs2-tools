// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createElement,
} from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
// import { useLongPress } from "use-long-press";

// icons:
import { BiCaretDownCircle } from "react-icons/bi";

// custom components:
import Debug from "./Debug";
import useTable, { Column, TableProps } from "../hooks/useTable";
// import useRenderCount from "../hooks/useRenderCount";
import SearchBar from "./TableSearchBar";
import MonstieInfoGraphic from "./MonstieInfoGraphic";
// import TableSidebar from "./TableSidebar";
// import RefModal from "./RefModal";
import { BiSearch } from "react-icons/bi";
import Asset from "./AssetComponents";

const elementSize = 20;

const Container = styled.div`
  /* border: 1px solid yellow; */
  position: relative;

  width: 100%;

  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const pattern1 = () => css`
  /* background-color: #f7a800; */
  background-size: calc(100% / 7) calc(100% / 7);
  background-image: linear-gradient(135deg, transparent 55%, blue 55%),
    radial-gradient(
      transparent 5px,
      #ffffff 6px,
      #ffffff 9px,
      transparent 10px,
      transparent 14px,
      #ffffff 15px,
      #ffffff 18px,
      transparent 19px,
      transparent 23px,
      #ffffff 24px,
      #ffffff 27px,
      transparent 28px
    );
`;

const pattern2 = () => css`
  /* background-color: #00b5f7; */
  /* background-size: calc(100% / 7) calc(100% / 7); */
  background-size: 50px 50px;
  background-image: radial-gradient(
    transparent 27px,
    #ffffff 28px,
    #ffffff 31px,
    transparent 32px
  );

  background-position: 25% 25%;
`;

const pattern3 = () => css`
  /* background-color: #f70b45; */
  /* background-size: calc(100% / 7) calc(100% / 7); */
  background-size: 25px 25px;
  background-image: radial-gradient(
      transparent 20px,
      red 21px,
      red 23px,
      transparent 24px
    ),
    radial-gradient(transparent 20px, red 21px, red 23px, transparent 24px);
  /* background-position: 0 0, 25px 25px; */
`;

const TableContainer = styled.table`
  padding: 1rem;
  /* border: 2px solid orange; */

  width: 1px;

  border-radius: 10px;
  /* overflow: hidden; */

  /* min-width: 100%; */
  /* width: 100%; */
  /* position: absolute; */
  position: relative;
  /* top: 0; */

  /* text-align: left; */

  /* display: flex; */
  /* flex-direction: column; */

  /* background-color: ${({ theme }) => theme.colors.surface.main}; */
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 50px;

  /* height:rem; */
  /* width: 100%; */

  border-bottom: 1px solid ${({ theme }) => theme.colors.background.main};
  border-top: 1px solid ${({ theme }) => theme.colors.background.main};

  /* background-color: darkgray; */
  opacity: 0.94;
  backdrop-filter: blur(2px);

  background-color: ${({ theme }) => theme.colors.surface.dark};
  /* background-size: 10px 10px;
  background-image: ${({ theme }) =>
    `radial-gradient(
      ${theme.colors.background.main} 10%,
      transparent 11%
       
    
    )`}; */

  /* background-position: 25% 25%; */
  /* background-position: 0 0; */

  display: flex;
  flex-direction: column;
  align-items: center;
`;
// ${({ tableHeight }: { tableHeight: number }) => css`
//   height: ${tableHeight}px;
//   min-height: ${tableHeight}px;
//   max-height: ${tableHeight}px;
// `}
const Tbody = styled.tbody`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* background-color: ${({ theme }) => theme.colors.onBackground.main}; */
`;

const TR = styled.tr`
  position: relative;
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.onSurface.main}; */

  padding: 0 1rem;
  height: 3rem;

  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  display: flex;

  td {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    height: 100%;
    /* padding: 0 1rem; */

    cursor: default;

    /* color: ${({ theme }) => theme.colors.background.main}; */
    font-size: 0.9rem;

    display: flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
    }
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    content: "";
    height: 1px;

    width: calc(100% - 8px);
    background-color: ${({ theme }) => theme.colors.background.main};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.main};
    border-radius: 5px;
    td {
      /* color: ${({ theme }) => theme.colors.onPrimary.main}; */

      /* font-weight: 600; */
    }

    &::after {
      opacity: 0;
    }
  }
`;

const TRChange = styled(TR)<{ expand: boolean }>`
  background-color: ${({ expand, theme }) =>
    expand ? theme?.colors.background.main : "transparent"};
`;

const HeaderRow = styled.tr`
  padding: 0 1rem;
  height: 4rem;

  background-color: transparent;

  display: flex;
`;

const ExpandableTR = styled(motion.tr)`
  ${({ width }: { width: number }) => css`
    width: ${width}px;
    min-width: ${width}px;
    max-width: ${width}px;
  `}
  background-color: transparent;

  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  box-shadow: inset 0px 0px 0px 1px
    ${({ theme }) => theme.colors.background.main};

  td {
    /* width: 100%; */
    height: 100%;
    overflow: hidden;
    display: flex;
  }

  &:hover {
    background-color: transparent;
  }
`;

const HeaderColumn = styled(motion.th)<{
  columnWidth: number;
  borderLeft: boolean;
}>`
  position: relative;
  /* overflow: hidden; */

  width: ${({ columnWidth }) => columnWidth}px;
  height: 100%;
  padding: 0 1rem;

  cursor: default;
  /* cursor: pointer; */
  user-select: none;
  white-space: nowrap;
  /* -webkit-user-select: none; */
  /* -webkit-touch-callout: none; */

  ${({ borderLeft, theme }) =>
    borderLeft &&
    css`
      border-left: 1px solid ${theme.colors.background.main};
    `}

  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const BlankRow = styled.tr`
  ${({ blankHeight }: { blankHeight: number }) => css`
    height: ${blankHeight}px;
    min-height: ${blankHeight}px;
    max-height: ${blankHeight}px;
  `}
`;

type DataColumnProps = {
  columnWidth: number;
  highlight: string;
  borderLeft: boolean;
};

const DataColumn = styled(motion.td)<DataColumnProps>`
  overflow: hidden;
  user-select: none;
  width: ${({ columnWidth }) => columnWidth}px;

  ${({ borderLeft, theme }) =>
    borderLeft &&
    css`
      border-left: 1px solid ${theme.colors.background.main};
    `}

  ${({ highlight, theme }) =>
    highlight === "strength"
      ? css`
          color: ${theme.colors.correct.main};
          font-weight: 600;
        `
      : highlight === "weakness"
      ? css`
          color: ${theme.colors.error.main};
          font-weight: 600;
        `
      : css`
          color: ${theme.colors.onSurface.main};
        `}
`;

const indicatorIconSize = 16;

type SortIndicatorProps = {
  orderType: string;
};

const SortIndicator = styled(motion.span)<SortIndicatorProps>`
  width: ${indicatorIconSize}px;
  height: ${indicatorIconSize}px;
  min-width: ${indicatorIconSize}px;
  min-height: ${indicatorIconSize}px;
  max-width: ${indicatorIconSize}px;
  max-height: ${indicatorIconSize}px;
  margin-left: 3px;

  svg {
    width: 100%;
    height: 100%;
    /* position: absolute; */
    /* top: 0; */
    /* left: 0; */
    path {
      transition: 100ms fill linear;
      fill: ${({ orderType, theme }) =>
        orderType === "ascend"
          ? theme.colors.correct.main
          : theme.colors.error.light};
    }
  }
`;

const ContextMenu = styled.div`
  overflow: hidden;
  width: 10rem;
  height: 10rem;
  background-color: black;
  color: white;
  position: absolute;
  top: 0;
  left: 0;

  transform: translateY(5rem);
`;

interface ColumnHeaderProps {
  // rowData: any;
  headerData: Column;
  // text: any;
  // width: number;
  toggleShiftSort: (key: string) => void;
  toggleMultiSort: (key: string) => void;

  toggleMenu: (key: string) => void;
  menu: boolean;
}

const ColumnHeader = memo(
  ({
    headerData,
    toggleShiftSort,
    toggleMultiSort,
    menu,
    toggleMenu,
  }: ColumnHeaderProps) => {
    // ({ headerData, toggleShiftSort, toggleMultiSort }: ColumnHeaderProps) => {
    // const [menu, setMenu] = useState(false);
    const containerRef = useRef<HTMLTableHeaderCellElement | null>(null);
    // const containerRef = useRef<HTMLButtonElement | null>(null);
    // const bind = useLongPress(
    //   () => {
    //     setMenu((v) => !v);
    //   },
    //   { threshold: 500 }
    // );

    const { width, key, sorted, desc, format, label } = headerData;
    const sortIndicatorVariant = useMemo(
      () => ({
        descend: {
          rotate: 0,
          scale: 1,
        },
        ascend: {
          rotate: 180,
          scale: 1,
        },

        none: {
          // rotate: 0,
          // scale: 0,
          rotate: [180, 360, 360, 360],
          scale: [1, 1, 0, 0],
        },
      }),
      []
    );

    const toggleSort = useCallback(
      () => toggleShiftSort(key),
      [key, toggleShiftSort]
    );

    const toggleSortRightClick = useCallback(
      (e) => {
        e.preventDefault();

        // toggleMultiSort(key);
        console.log("rightclick");
        // if (window.innerWidth > 550) setMenu((v) => !v);
        // setMenu((v) => !v);
        toggleMenu(key);
      },
      [key, toggleMultiSort]
    );

    return (
      <HeaderColumn
        ref={containerRef}
        columnWidth={width}
        onClick={toggleSort}
        // onContextMenu={toggleSortRightClick}
        // {...bind}
        initial={{
          width,
          paddingLeft: 14,
          paddingRight: 14,
        }}
        animate={{
          width,
          paddingLeft: 14,
          paddingRight: 14,
        }}
        exit={{ width: 0, paddingLeft: 0, paddingRight: 0 }}
        borderLeft={label.toLowerCase().includes("element")}
      >
        {label ? <Asset asset={label} title={label} size={elementSize} /> : key}
        {menu && (
          <ContextMenu
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            // onContextMenu={(e: any) => {
            //   e.stopPropagation();
            //   e.preventDefault();
            // }}
            onMouseLeave={(e: any) => {
              e.stopPropagation();
              toggleMenu("");
            }}
          >
            lsdkfjlsdjf
          </ContextMenu>
        )}
        <SortIndicator
          orderType={sorted}
          variants={sortIndicatorVariant}
          initial={sorted}
          animate={sorted}
        >
          <BiCaretDownCircle />
        </SortIndicator>
        {/* <HeaderBtn
          type="button"
          ref={containerRef}
          onClick={toggleSortRightClick}
          onContextMenu={toggleSortRightClick}
        >
          jfkdsjflksdjf
        </HeaderBtn> */}
      </HeaderColumn>
    );
  }
);

interface DataPieceProps {
  columnData: Column;
  data: any;
}

const DataPiece = memo(({ columnData, data }: DataPieceProps) => {
  const { key, desc, label, sorted, width, format } = columnData;
  const value = data[key];

  const strength = key === `atk_${data.strength}`;
  const weakness = key === `def_${data.weakness}`;

  const highlight = strength ? "strength" : weakness ? "weakness" : "none";
  return (
    <DataColumn
      title={value}
      columnWidth={width}
      initial={{
        width,
        paddingLeft: 14,
        paddingRight: 14,
      }}
      animate={{
        width,
        paddingLeft: 14,
        paddingRight: 14,
      }}
      exit={{ width: 0, paddingLeft: 0, paddingRight: 0 }}
      highlight={highlight}
      borderLeft={columnData.label.toLowerCase().includes("element")}
    >
      {value}
    </DataColumn>
  );
});

const TempSearchButton = styled.button`
  position: absolute;

  z-index: 999;

  bottom: 0rem;
  right: 0rem;

  margin: 3rem;

  border-radius: 50%;
  width: 4rem;
  height: 4rem;

  /* margin: 1rem; */

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

const Caption = styled.caption`
  height: 2rem;
  padding: 0 1rem;

  font-weight: 600;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
  /* justify-content: center; */
  align-items: center;

  margin-bottom: 1rem;
  /* background-color: red; */
`;

interface RowItemProps {
  data: any;
  columnAttrs: Column[];
  index: number;
}

const RowItem = memo(({ data, columnAttrs, index }: RowItemProps) => {
  const containerRef = useRef<HTMLTableRowElement | null>(null);

  const [width, setWidth] = useState(0);
  const [expand, setExpand] = useState(false);
  // const { width = 0 } = useResizeObserver({ ref: containerRef });

  // const animationProps = {
  //   variants: {
  //     open: {
  //       height: 200,
  //     },
  //     close: { height: 0 },
  //   },
  //   initial: "close",
  //   animate: expand ? "open" : "close",
  // };

  const animationProps = {
    variants: {
      open: {
        height: 300,
      },
      close: { height: 0 },
    },

    initial: "close",
    animate: "open",
    exit: "close",
  };

  useEffect(() => {
    const w = containerRef.current?.getBoundingClientRect().width || 0;
    setWidth(w);
  }, []);

  const toggleExpand = () => setExpand((v) => !v);
  return (
    <>
      <TRChange expand={expand} onClick={toggleExpand} ref={containerRef}>
        {/* <AnimatePresence> */}
        {columnAttrs.map((columnData: Column, j: number) => (
          <DataPiece
            key={`body-column-${data.name}-${columnData.key}`}
            columnData={columnData}
            data={data}
          />
        ))}
        {/* </AnimatePresence> */}
      </TRChange>
      <AnimatePresence>
        {expand && (
          <ExpandableTR width={width} {...animationProps}>
            <td>
              <MonstieInfoGraphic data={data} />
            </td>
          </ExpandableTR>
        )}
      </AnimatePresence>

      {/* <ExpandableTR width={width} {...animationProps}></ExpandableTR> */}
    </>
  );
});

const Table = memo(({ data, column }: TableProps) => {
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

  const [searchText, setSearchText] = useState("");
  const [headerMenu, setHeaderMenu] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(document.getElementById("root"));
  const { width = 0, height = 0 } = useResizeObserver({ ref: scrollRef });
  const [extraContentHeight, setExtraContentHeight] = useState(0);

  const toggleMenu = (key: string) => {
    setHeaderMenu(key);
  };

  useEffect(() => {
    filterData(searchText);
  }, [searchText]);

  return (
    <>
      <TempSearchButton type="button" onClick={() => setShowSearch((v) => !v)}>
        <BiSearch />
      </TempSearchButton>
      {showSearch && (
        <SearchBar
          value={searchText}
          onChange={(e: any) => setSearchText(e.target.value)}
          placeholderText="Search for your favorite monstie, abilities, and more!"
          results={`${tableData.length} result${
            tableData.length === 1 ? "" : "s"
          }`}
        />
      )}
      <Container className="Table-Container">
        <TableContainer>
          {/* <Caption>Monstie Table</Caption> */}
          <Thead>
            <HeaderRow>
              <AnimatePresence>
                {columnAttrs.map((headerData, i: number) => (
                  <ColumnHeader
                    key={`header-column-${headerData.key}`}
                    headerData={headerData}
                    toggleShiftSort={toggleShiftSort}
                    toggleMultiSort={toggleMultiSort}
                    menu={headerMenu === headerData.key}
                    toggleMenu={toggleMenu}
                  />
                ))}
              </AnimatePresence>
            </HeaderRow>
          </Thead>
          <Tbody>
            {tableData.map((row: any, i: number) => {
              // if (i >= startIndex && i <= endIndex)
              return (
                <RowItem
                  key={`data-row-${row.name}-${row.strength}`}
                  columnAttrs={columnAttrs}
                  data={tableData[i]}
                  index={i}
                />
              );
              // else return null;
            })}
          </Tbody>
        </TableContainer>
      </Container>
    </>
  );
});

export default Table;
