// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { AnimateSharedLayout, motion } from "framer-motion";
import { createRef, Ref, RefObject, useEffect, useRef, useState } from "react";

// types:
import { MonstieGene } from "../utils/ProjectTypes";
import { DropProps } from "../hooks/useDrop";

// custom components:
import GeneSlot from "./GeneSlot";
import DraggableGene from "./DraggableGene";
import Debug from "./Debug";

// utils:
import {
  EMPTY_BOARD,
  addEmptyGeneInfo as clean,
  place,
  swap,
  shuffleArray,
  isEmptyGene,
  findAllBingos,
  matrix,
} from "../utils/utils";
import { DROP_TYPES } from "../utils/DropTypes";
import Asset from "./AssetComponents";

const SLOT_SIZE = 110;

const GRID_SIZE = 350;
const bingoCircleSize = 25;

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
  background-size: calc(100% / 7) calc(100% / 7);
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
  background-size: calc(100% / 7) calc(100% / 7);
  background-image: radial-gradient(
      transparent 20px,
      #ffffff 21px,
      #ffffff 23px,
      transparent 24px
    ),
    radial-gradient(
      transparent 20px,
      #ffffff 21px,
      #ffffff 23px,
      transparent 24px
    );
  background-position: 0 0, 25px 25px;
`;

const gap = 14;
// ${pattern2}
const Grid = styled.div`
  overflow: hidden;

  display: grid;

  padding: ${(gap / 3) * 1.5}px;
  gap: ${gap / 3}px;

  width: ${GRID_SIZE}px;
  height: ${GRID_SIZE}px;

  /* image-rendering: smooth; */

  border-radius: 10px;

  /* background-color: white; */
  background-color: ${({ theme }) => theme.colors.surface.main};

  /* background: ${({ theme }) =>
    `linear-gradient(115deg, ${theme.colors.background.dark} 49.6%, ${theme.colors.surface.main} 50%)`}; */

  /* background-color: blue; */

  /* background-image: radial-gradient(red 1px, transparent 1px); */
  /* background-size: 50px 50px; */

  grid:
    "e-diagnol1 e-column1 e-column2 e-column3 a-diagnol2"
    "e-row1     gene-grid gene-grid gene-grid a-row1"
    "e-row2     gene-grid gene-grid gene-grid a-row2"
    "e-row3     gene-grid gene-grid gene-grid a-row3"
    "e-diagnol2 a-column1 a-column2 a-column3 a-diagnol1";

  grid-template-columns:
    minmax(0, 1fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 3fr)
    minmax(0, 1fr);

  grid-template-rows:
    minmax(0, 1fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 3fr)
    minmax(0, 1fr);
  /* gap: 0.75rem; */

  /* gap: 0.5rem; */
`;

const Cell = styled.div<{ gridArea: GridArea }>`
  grid-area: ${({ gridArea }) => gridArea};

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  /* outline: 1px solid red; */

  /* background-color: ${({ theme }) => theme.colors.background.main}; */
`;

const BingoTypeWrapper = styled.div`
  /* background-color: ${({ theme }) => theme.colors.background.main}; */

  min-width: ${bingoCircleSize}px;
  min-height: ${bingoCircleSize}px;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const GeneGridCell = styled.div`
  grid-area: gene-grid;

  position: relative;
  /* padding: ${gap / 3}px; */

  border-radius: 5px;

  width: 100%;
  height: 100%;

  /* display: inline-block; */

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.surface.main};
  /* box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.75); */
  /* box-shadow: 0px 17px 60px -20px ${({ theme }) =>
    theme.colors.primary.main}; */

  display: flex;
  justify-content: center;
  align-items: center;
`;

const geneGridCellStyles = () => css`
  width: 100%;
  height: 100%;

  gap: ${gap}px;
  padding: ${gap / 3}px;
  /* gap: ${gap}px;
  padding: ${gap}px; */

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
`;

const SlotGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* background-color: ${({ theme }) => theme.colors.surface.main}; */

  ${geneGridCellStyles}
`;

const GeneGrid = styled(motion.div)`
  position: relative;
  z-index: 200;

  ${geneGridCellStyles}
`;

const EmptySlot = styled.div``;

/////////////////////////////////////////////////////////////////////////////////

type BingoBoardProps = {
  data?: MonstieGene[];
  drop: DropProps;
  setDrop: React.Dispatch<React.SetStateAction<DropProps>>;
  setDropSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const gridAreas = [
  "gene-grid",
  "e-diagnol1",
  "e-diagnol2",
  "e-row1",
  "e-row2",
  "e-row3",
  "e-column1",
  "e-column2",
  "e-column3",
  "a-diagnol1",
  "a-diagnol2",
  "a-row1",
  "a-row2",
  "a-row3",
  "a-column1",
  "a-column2",
  "a-column3",
];

type GridArea = typeof gridAreas[number];
type GridElement = { gridArea: GridArea; type: any };

const gridElements: GridElement[] = [
  ...gridAreas.map((area) => ({ gridArea: area, type: area })),
].filter((areas) => areas.gridArea !== "gene-grid");

console.log(gridElements);

const BingoBoard = ({
  drop,
  setDrop,
  setDropSuccess,
  data,
}: BingoBoardProps) => {
  // STATE:
  const [isDragging, setIsDragging] = useState(false);
  const [dragGene, setDragGene] = useState<MonstieGene | null>(null);
  const [board, setBoard] = useState<MonstieGene[]>(clean(EMPTY_BOARD));
  const [slotRefs, setSlotRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [outerGrid, setOuterGrid] = useState<GridElement[]>(gridElements);

  // DERIVED STATE:
  const boardLength = board.length;

  // FUNCTIONS:
  const getIntersectionIndex = (dropPosition: { x: number; y: number }) => {
    let targetIndex = -1;

    const { x, y } = dropPosition;
    slotRefs.forEach((el, i) => {
      const { top, bottom, left, right } =
        el?.current?.getBoundingClientRect() as DOMRect;

      if (x < right && x > left && y < bottom && y > top) targetIndex = i;
    });

    return targetIndex;
  };

  const placeGene = (targetIndex: number, gene: MonstieGene) =>
    setBoard((genes) => {
      // housekeeping:
      const i = genes.findIndex(({ geneName }) => geneName === gene.geneName);
      const copy = [...genes];
      let success = true;

      // the droppedGene is already on the board:
      if (i !== -1) success = false;
      // place the gene at the target location:
      else place(targetIndex, gene, copy);

      setDropSuccess(success);
      return copy;
    });

  const swapGenes = (targetIndex: number, gene: MonstieGene) =>
    setBoard((genes) => {
      // housekeeping:
      const i = genes.findIndex(({ geneName }) => geneName === gene.geneName);
      const copy = [...genes];

      // dragged from another board component so a swap isnt possible:
      if (i === -1) place(targetIndex, gene, copy);
      // swap the two elements in question:
      else swap(i, targetIndex, copy);

      setDropSuccess(true);
      return copy;
    });

  const shuffle = () => setBoard((list) => clean(shuffleArray([...list])));

  useEffect(() => {
    setSlotRefs((refs) =>
      [...Array(boardLength).keys()].map((_, i) => refs[i] || createRef())
    );
  }, [boardLength]);

  useEffect(() => {
    const { type, position, data } = drop;
    const targetIndex = getIntersectionIndex(position);

    if (targetIndex !== -1) {
      switch (type) {
        case DROP_TYPES.GENE_SWAP:
          swapGenes(targetIndex, data);
          break;
        case DROP_TYPES.GENE_PLACE:
          placeGene(targetIndex, data);
          break;
        default:
          setDropSuccess(false);
          break;
      }
    }
  }, [drop]);

  useEffect(() => {
    const attackTypes = board.map(({ attackType }, i) =>
      attackType === "" ? i : attackType
    );

    const elementTypes = board.map(({ elementType }, i) =>
      elementType === "" ? i : elementType
    );

    const attackTypeBingos = findAllBingos(attackTypes).map((bingo) => ({
      ...bingo,
      location: `a-${bingo.location}`,
    }));

    const elementTypeBingos = findAllBingos(elementTypes).map((bingo) => ({
      ...bingo,
      location: `e-${bingo.location}`,
    }));

    const arr: GridElement[] = [];
    attackTypeBingos.forEach((bingo) =>
      arr.push({ gridArea: bingo.location, type: bingo.type })
    );
    elementTypeBingos.forEach((bingo) =>
      arr.push({ gridArea: bingo.location, type: bingo.type })
    );

    // console.log("-----------------------------");
    // console.log(matrix(elementTypes));
    // console.log(elementTypeBingos);
    // console.log(matrix(attackTypes));
    // console.log(attackTypeBingos);
    // console.log(arr);

    setOuterGrid(arr);
  }, [board]);

  return (
    <>
      {/* <Debug data={board.map((gene) => gene.geneName)} drag /> */}
      {/* <button type="button" onClick={shuffle}>
        shuffle
      </button> */}

      <Grid>
        {outerGrid.map((el) => (
          <Cell key={el.gridArea} gridArea={el.gridArea}>
            <BingoTypeWrapper>
              <Asset
                asset={el.type}
                size={20}
                title={`${el.type} ${el.gridArea}`}
              />
            </BingoTypeWrapper>
          </Cell>
        ))}
        <GeneGridCell
          onClick={() => {
            console.log(board);
          }}
        >
          <SlotGrid>
            {board.map((_, i) => (
              <GeneSlot ref={slotRefs[i]} key={i} index={i} />
            ))}
          </SlotGrid>

          <GeneGrid>
            <AnimateSharedLayout>
              {board.map((gene, i) =>
                !isEmptyGene(gene) ? (
                  <DraggableGene
                    key={gene.geneName}
                    gene={gene}
                    onDragStart={() => {
                      setIsDragging(true);
                      setDragGene(gene);
                    }}
                    onDragEnd={(_, drag) => {
                      setIsDragging(false);
                      setDragGene(gene);
                      setDrop({
                        type: DROP_TYPES.GENE_SWAP,
                        position: drag.point,
                        data: gene,
                      });
                    }}
                    bringToFront={dragGene?.geneName === gene.geneName}
                  />
                ) : (
                  <EmptySlot key={gene.geneName} />
                )
              )}
            </AnimateSharedLayout>
          </GeneGrid>
        </GeneGridCell>
      </Grid>
    </>
  );
};

export default BingoBoard;

// // styling:
// import { css, jsx } from "@emotion/react";
// import styled from "@emotion/styled";

// // library:
// import { AnimateSharedLayout, motion } from "framer-motion";
// import { createRef, Ref, RefObject, useEffect, useRef, useState } from "react";

// // types:
// import { MonstieGene } from "./Gene";
// import { DropProps } from "../hooks/useDrop";

// // custom components:
// import GeneSlot from "./GeneSlot";
// import DraggableGene from "./DraggableGene";
// import Debug from "./Debug";

// // utils:
// import {
//   EMPTY_BOARD,
//   addEmptyGeneInfo as clean,
//   place,
//   swap,
//   shuffleArray,
//   isEmptyGene,
//   findAllBingos,
//   matrix,
// } from "../utils/utils";
// import { DROP_TYPES } from "../utils/DropTypes";

// const SLOT_SIZE = 110;

// const Container = styled.div`
//   position: relative;
//   width: ${SLOT_SIZE * 3}px;
//   height: ${SLOT_SIZE * 3}px;
// `;

// const gridStyles = () => css`
//   width: 100%;
//   height: 100%;

//   display: grid;
//   grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
//   grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
//   gap: 0.5rem;
// `;

// const SlotGrid = styled(motion.div)`
//   position: relative;
//   background-color: ${({ theme }) => theme.colors.surface.main};

//   ${gridStyles}
// `;

// const GeneGrid = styled(motion.div)`
//   position: absolute;
//   top: 0;
//   left: 0;
//   ${gridStyles}
// `;

// const EmptySlot = styled.div``;

// /////////////////////////////////////////////////////////////////////////////////

// type BingoBoardProps = {
//   data?: MonstieGene[];
//   drop: DropProps;
//   setDrop: React.Dispatch<React.SetStateAction<DropProps>>;
//   setDropSuccess: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const BingoBoard = ({
//   drop,
//   setDrop,
//   setDropSuccess,
//   data,
// }: BingoBoardProps) => {
//   // STATE:
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragGene, setDragGene] = useState<MonstieGene | null>(null);
//   const [board, setBoard] = useState<MonstieGene[]>(clean(EMPTY_BOARD));
//   const [slotRefs, setSlotRefs] = useState<RefObject<HTMLDivElement>[]>([]);

//   // DERIVED STATE:
//   const boardLength = board.length;

//   // FUNCTIONS:
//   const getIntersectionIndex = (dropPosition: { x: number; y: number }) => {
//     let targetIndex = -1;

//     const { x, y } = dropPosition;
//     slotRefs.forEach((el, i) => {
//       const { top, bottom, left, right } =
//         el?.current?.getBoundingClientRect() as DOMRect;

//       if (x < right && x > left && y < bottom && y > top) targetIndex = i;
//     });

//     return targetIndex;
//   };

//   const placeGene = (targetIndex: number, gene: MonstieGene) =>
//     setBoard((genes) => {
//       // housekeeping:
//       const i = genes.findIndex(({ geneName }) => geneName === gene.geneName);
//       const copy = [...genes];
//       let success = true;

//       // the droppedGene is already on the board:
//       if (i !== -1) success = false;
//       // place the gene at the target location:
//       else place(targetIndex, gene, copy);

//       setDropSuccess(success);
//       return copy;
//     });

//   const swapGenes = (targetIndex: number, gene: MonstieGene) =>
//     setBoard((genes) => {
//       // housekeeping:
//       const i = genes.findIndex(({ geneName }) => geneName === gene.geneName);
//       const copy = [...genes];

//       // dragged from another board component so a swap isnt possible:
//       if (i === -1) place(targetIndex, gene, copy);
//       // swap the two elements in question:
//       else swap(i, targetIndex, copy);

//       setDropSuccess(true);
//       return copy;
//     });

//   const shuffle = () => setBoard((list) => clean(shuffleArray([...list])));

//   useEffect(() => {
//     setSlotRefs((refs) =>
//       [...Array(boardLength).keys()].map((_, i) => refs[i] || createRef())
//     );
//   }, [boardLength]);

//   useEffect(() => {
//     const { type, position, data } = drop;
//     const targetIndex = getIntersectionIndex(position);

//     if (targetIndex !== -1) {
//       switch (type) {
//         case DROP_TYPES.GENE_SWAP:
//           swapGenes(targetIndex, data);
//           break;
//         case DROP_TYPES.GENE_PLACE:
//           placeGene(targetIndex, data);
//           break;
//         default:
//           setDropSuccess(false);
//           break;
//       }
//     }
//   }, [drop]);

//   return (
//     <>
//       {/* <Debug data={board.map((gene) => gene.geneName)} drag /> */}
//       <button type="button" onClick={shuffle}>
//         shuffle
//       </button>

//       <Container
//         onClick={() => {
//           const attackTypes = board.map((v) => v.attackType);
//           const elementTypes = board.map((v) => v.elementType);

//           console.log(matrix(attackTypes));
//           console.log("attackTypes:", findAllBingos(attackTypes));
//           console.log(matrix(elementTypes));
//           console.log("elementTypes:", findAllBingos(elementTypes));
//         }}
//       >
//         <SlotGrid>
//           {board.map((_, i) => (
//             <GeneSlot ref={slotRefs[i]} key={i} index={i} />
//           ))}
//         </SlotGrid>

//         <GeneGrid>
//           <AnimateSharedLayout>
//             {board.map((gene, i) =>
//               !isEmptyGene(gene) ? (
//                 <DraggableGene
//                   key={gene.geneName}
//                   gene={gene}
//                   onDragStart={() => {
//                     setIsDragging(true);
//                     setDragGene(gene);
//                   }}
//                   onDragEnd={(_, drag) => {
//                     setIsDragging(false);
//                     setDragGene(gene);
//                     setDrop({
//                       type: DROP_TYPES.GENE_SWAP,
//                       position: drag.point,
//                       data: gene,
//                     });
//                   }}
//                   bringToFront={dragGene?.geneName === gene.geneName}
//                 />
//               ) : (
//                 <EmptySlot key={gene.geneName} />
//               )
//             )}
//           </AnimateSharedLayout>
//         </GeneGrid>
//       </Container>
//     </>
//   );
// };

// export default BingoBoard;
