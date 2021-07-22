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
import SvgWrapper from "./SvgWrapper";

// assets:
import { ReactComponent as DragonSvg } from "../assets/dragon.svg";
import { ReactComponent as FireSvg } from "../assets/fire.svg";
import { ReactComponent as IceSvg } from "../assets/ice.svg";
import { ReactComponent as NonElementSvg } from "../assets/non_elemental.svg";
import { ReactComponent as ThunderSvg } from "../assets/thunder.svg";
import { ReactComponent as WaterSvg } from "../assets/water.svg";

const elementSize = 20;

// const SvgWrapperContainer = styled.span<{ size: number }>`
//   svg {
//     ${({ size }) =>
//       size !== -1 &&
//       css`
//         width: ${size}px;
//         height: ${size}px;
//       `};
//   }
// `;

// type SvgWrapperProps = {
//   svgReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & {
//       title?: string | undefined;
//     }
//   >;
//   size?: number;
//   title?: string;
// };

// const SvgWrapper = ({
//   svgReactComponent: icon,
//   size = -1,
//   title,
// }: SvgWrapperProps) => {
//   return (
//     <SvgWrapperContainer size={size} title={title}>
//       {createElement(icon)}
//     </SvgWrapperContainer>
//   );
// };

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
  top: 3rem;
  z-index: 100;

  border-bottom: 1px solid ${({ theme }) => theme.colors.onSurface.main};

  background-color: ${({ theme }) => theme.colors.onBackground.main};
  opacity: 0.94;
  backdrop-filter: blur(2px);

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

//  tr {
//     /* position: relative; */
//     border-bottom: 1px solid ${({ theme }) => theme.colors.onSurface.main};

//     padding: 0 1rem;
//     height: 3rem;

//     display: flex;

//     td {
//       position: relative;
//       overflow: hidden;
//       white-space: nowrap;
//       text-overflow: ellipsis;

//       height: 100%;
//       /* padding: 0 1rem; */

//       cursor: default;

//       color: ${({ theme }) => theme.colors.background.main};
//       font-size: 0.9rem;

//       display: flex;
//       align-items: center;

//       &:hover {
//         text-decoration: underline;
//       }
//     }
//   }

//   tr:hover {
//     background-color: ${({ theme }) => theme.colors.primary.main};
//     border-radius: 5px;
//     td {
//       color: ${({ theme }) => theme.colors.onPrimary.main};

//       font-weight: 600;
//     }
//   }

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
    background-color: ${({ theme }) => theme.colors.onSurface.main};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.onSurface.main};
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
    expand ? theme?.colors.onSurface.main : "transparent"};
`;

const HeaderRow = styled.tr`
  padding: 0 1rem;
  height: 5rem;

  background-color: transparent;

  display: flex;
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
      border-left: 1px solid ${theme.colors.onSurface.main};
    `}

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
      border-left: 1px solid ${theme.colors.onSurface.main};
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
          color: ${theme.colors.background.main};
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

    const getElementHeader = (headerLabel: string) => {
      const label = headerLabel.toLowerCase();
      switch (label) {
        case "non elemental attack":
          return (
            <SvgWrapper
              svgComponent={NonElementSvg}
              size={elementSize}
              title={headerLabel}
            />
          );
        case "fire attack":
          return (
            <SvgWrapper
              svgComponent={FireSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "water attack":
          return (
            <SvgWrapper
              svgComponent={WaterSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "thunder attack":
          return (
            <SvgWrapper
              svgComponent={ThunderSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "ice attack":
          return (
            <SvgWrapper
              svgComponent={IceSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "dragon attack":
          return (
            <SvgWrapper
              svgComponent={DragonSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "non elemental defense":
          return (
            <SvgWrapper
              svgComponent={NonElementSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "fire defense":
          return (
            <SvgWrapper
              svgComponent={FireSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "water defense":
          return (
            <SvgWrapper
              svgComponent={WaterSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "thunder defense":
          return (
            <SvgWrapper
              svgComponent={ThunderSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "ice defense":
          return (
            <SvgWrapper
              svgComponent={IceSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        case "dragon defense":
          return (
            <SvgWrapper
              svgComponent={DragonSvg}
              size={elementSize}
              title={headerLabel}
            />
          );

        default:
          break;
      }

      return headerLabel;
    };

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
        {label ? getElementHeader(label) : key}
        {menu && (
          <ContextMenu
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            // onContextMenu={(e: any) => {
            //   e.stopPropagation();
            //   e.preventDefault();
            // }}
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
    ${({ theme }) => theme.colors.onSurface.main};

  td {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
  }

  &:hover {
    background-color: transparent;
  }
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

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(document.getElementById("root"));
  const { width = 0, height = 0 } = useResizeObserver({ ref: scrollRef });
  const [extraContentHeight, setExtraContentHeight] = useState(0);

  // 14 comes from theme.dimensions.unit or 1rem
  // const itemHeight = 14 * 3; // 3rem

  // const listHeight = itemHeight * tableData.length;

  // const startIndex = Math.max(
  //   0, // ensures that we get an index of atleast 0
  //   Math.floor((scrollPosition - extraContentHeight) / itemHeight)
  // );

  // const endIndex = Math.max(
  //   0, //  ensures that we get atleast an index of 0 in the case that:
  //   // scrollTop + height < extraContentHeight
  //   Math.min(
  //     tableData.length - 1, // don't render past the end of the list
  //     Math.floor((scrollPosition + height - extraContentHeight) / itemHeight)
  //   )
  // );

  const toggleMenu = (key: string) => {
    setHeaderMenu(key);
  };

  // useEffect(() => {
  //   scrollRef.current = document.getElementById("page-container");
  //   const setScrollTopRef = () =>
  //     setScrollPosition(scrollRef.current?.scrollTop as number);

  //   scrollRef.current?.addEventListener("scroll", setScrollTopRef);

  //   return () => {
  //     scrollRef.current?.removeEventListener("scroll", setScrollTopRef);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     const fullHeight = scrollRef.current.scrollHeight;
  //     setExtraContentHeight(fullHeight - listHeight);
  //   }
  // }, [height, width, listHeight]);

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
      {/* <button onClick={() => changeColumnOrder("name", 0)}>
        name to first
      </button>
      <button onClick={() => toggleShiftSort("team")}>sort team</button>
      <button onClick={() => toggleColumn("name")}>toggle name</button>
      <button onClick={() => toggleColumn("edpi")}>toggle edpi</button> */}

      {/* <TableSidebar column={columnAttrs} /> */}

      <SearchBar
        value={searchText}
        onChange={(e: any) => setSearchText(e.target.value)}
        placeholderText="Search for your favorite monstie, abilities, and more!"
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
          <Tbody

          // tableHeight={listHeight}
          >
            {/* <BlankRow blankHeight={startIndex * itemHeight} /> */}

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
