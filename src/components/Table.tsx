// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
// import { useLongPress } from "use-long-press";
// icons:
import { BiCaretDownCircle } from "react-icons/bi";

// custom components:
import Debug from "./Debug";
import useTable, { Column, TableProps } from "../hooks/useTable";
// import useRenderCount from "../hooks/useRenderCount";

import SearchBar from "./TableSearchBar";
// import TableSidebar from "./TableSidebar";
// import RefModal from "./RefModal";

const Container = styled.div`
  /* border: 1px solid yellow; */
  position: relative;
`;

const TableContainer = styled.table`
  /* border: 2px solid orange; */

  min-width: 100%;
  position: absolute;
  top: 0;

  /* text-align: left; */

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.onBackground.main};
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 100;

  /* border-bottom: 1px solid ${({ theme }) => theme.colors.onSurface.main}; */

  background-color: ${({ theme }) => theme.colors.onBackground.main};
  opacity: 0.94;
  backdrop-filter: blur(2px);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Tbody = styled.tbody`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* background-color: ${({ theme }) => theme.colors.onBackground.main}; */

  ${({ tableHeight }: { tableHeight: number }) => css`
    height: ${tableHeight}px;
    min-height: ${tableHeight}px;
    max-height: ${tableHeight}px;
  `}

  tr {
    /* position: relative; */
    border-top: 1px solid ${({ theme }) => theme.colors.onSurface.main};

    padding: 0 1rem;
    height: 3rem;

    display: flex;

    td {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      height: 100%;
      /* padding: 0 1rem; */

      cursor: default;

      color: ${({ theme }) => theme.colors.background.main};
      font-size: 0.9rem;

      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-radius: 5px;
    td {
      color: ${({ theme }) => theme.colors.onPrimary.main};

      font-weight: 600;
    }
  }
`;

const HeaderRow = styled.tr`
  padding: 0 1rem;
  height: 5rem;

  background-color: transparent;

  display: flex;
`;

const HeaderColumn = styled(motion.th)`
  position: relative;
  /* overflow: hidden; */

  width: ${({ columnWidth }: { columnWidth: number }) => columnWidth}px;
  height: 100%;
  padding: 0 1rem;

  cursor: default;
  /* cursor: pointer; */
  user-select: none;
  white-space: nowrap;
  /* -webkit-user-select: none; */
  /* -webkit-touch-callout: none; */

  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.surface.main};

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

const DataColumn = styled(motion.td)`
  overflow: hidden;
  user-select: none;
  width: ${({ columnWidth }: { columnWidth: number }) => columnWidth}px;
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

const HeaderBtn = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
  width: 100%;
  height: 100%;
  z-index: 0;

  &:hover {
    background-color: blue;
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
        onContextMenu={toggleSortRightClick}
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
      >
        {label ? label : key}
        {menu && (
          <ContextMenu
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            onContextMenu={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseLeave={(e) => {
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
    >
      {value}
    </DataColumn>
  );
});
interface RowItemProps {
  data: any;
  columnAttrs: Column[];
  index: number;
}
const RowItem = memo(({ data, columnAttrs, index }: RowItemProps) => {
  return (
    <tr>
      <AnimatePresence>
        {columnAttrs.map((columnData: Column, j: number) => (
          <DataPiece
            key={`body-column-${data.name}-${columnData.key}`}
            columnData={columnData}
            data={data}
          />
        ))}
      </AnimatePresence>
    </tr>
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

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(document.getElementById("root"));
  const { width = 0, height = 0 } = useResizeObserver({ ref: scrollRef });
  const [extraContentHeight, setExtraContentHeight] = useState(0);

  // 14 comes from theme.dimensions.unit or 1rem
  const itemHeight = 14 * 3; // 3rem

  const listHeight = itemHeight * tableData.length;

  const startIndex = Math.max(
    0, // ensures that we get an index of atleast 0
    Math.floor((scrollPosition - extraContentHeight) / itemHeight)
  );

  const endIndex = Math.max(
    0, //  ensures that we get atleast an index of 0 in the case that:
    // scrollTop + height < extraContentHeight
    Math.min(
      tableData.length - 1, // don't render past the end of the list
      Math.floor((scrollPosition + height - extraContentHeight) / itemHeight)
    )
  );

  const toggleMenu = (key: string) => {
    setHeaderMenu(key);
  };

  useEffect(() => {
    scrollRef.current = document.getElementById("page-container");
    const setScrollTopRef = () =>
      setScrollPosition(scrollRef.current?.scrollTop as number);

    scrollRef.current?.addEventListener("scroll", setScrollTopRef);

    return () => {
      scrollRef.current?.removeEventListener("scroll", setScrollTopRef);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const fullHeight = scrollRef.current.scrollHeight;
      setExtraContentHeight(fullHeight - listHeight);
    }
  }, [height, width, listHeight]);

  useEffect(() => {
    filterData(searchText);
  }, [searchText]);

  return (
    <>
      {/* <Debug
        drag
        data={{
          scrollPosition: Math.round(scrollPosition),
          startIndex,
          endIndex,
          itemsShown: endIndex - startIndex + 1,
          windowHeight: height,
          windowWidth: width,
          listHeight: listHeight,
          extraContentHeight,
        }}
      /> */}
      {/* <Debug data={{ columnAttrs, sorts, hiddenColumns }} drag /> */}
      <button onClick={() => changeColumnOrder("name", 0)}>
        name to first
      </button>
      <button onClick={() => toggleShiftSort("team")}>sort team</button>
      <button onClick={() => toggleColumn("name")}>toggle name</button>
      <button onClick={() => toggleColumn("edpi")}>toggle edpi</button>

      {/* <TableSidebar column={columnAttrs} /> */}

      <SearchBar
        value={searchText}
        onChange={(e: any) => setSearchText(e.target.value)}
        placeholderText="Look for your favorite player, team, mouse, and more!"
        results={`${tableData.length} result${
          tableData.length === 1 ? "" : "s"
        }`}
      />
      <Container className="Table-Container">
        <TableContainer>
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
          <Tbody tableHeight={listHeight}>
            <BlankRow blankHeight={startIndex * itemHeight} />

            {tableData.map((row: any, i: number) => {
              if (i >= startIndex && i <= endIndex)
                return (
                  <RowItem
                    key={`data-row-${row.name}`}
                    columnAttrs={columnAttrs}
                    data={tableData[i]}
                    index={i}
                  />
                );
              else return null;
            })}
          </Tbody>
          {/* <Tbody tableHeight={listHeight}>
            {tableData.map((row: any, i: number) => {
              return (
                <RowItem
                  key={`data-row-${row.name}`}
                  columnAttrs={columnAttrs}
                  data={tableData[i]}
                  index={i}
                />
              );
            })}
          </Tbody> */}
        </TableContainer>
      </Container>
    </>
  );
});

export default Table;
