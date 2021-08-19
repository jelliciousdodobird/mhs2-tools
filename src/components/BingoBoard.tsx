// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { AnimateSharedLayout, motion } from "framer-motion";
import { createRef, Ref, RefObject, useEffect, useRef, useState } from "react";

// types:
import { GeneSkill } from "../utils/ProjectTypes";
import { DropProps } from "../hooks/useDrop";

// custom components:
import GeneSlot from "./GeneSlot";
import DraggableGene from "./DraggableGene";
import Debug from "./Debug";

// utils:
import {
  addEmptyGeneInfo as clean,
  place,
  swap,
  shuffleArray,
  isBlankGene,
  findBingosInFlatArray,
  cleanGeneBuild,
  matrix,
} from "../utils/utils";
import { DROP_TYPES } from "../utils/DropTypes";
import Asset from "./AssetComponents";
import useResizeObserver from "use-resize-observer/polyfilled";

const SLOT_SIZE = 110;

const GRID_SIZE = 350;
const bingoCircleSize = 25;

const gap = 14;
// ${pattern2}

const MAX_SIZE = 400;
const MIN_SIZE = 300;
// width: 100%;
// height: ${({ gridHeight }) => gridHeight}px;
// min-height: ${({ gridHeight }) => gridHeight}px;

// max-width: ${MAX_SIZE}px;
// max-height: ${MAX_SIZE}px;
const Grid = styled.div<{ gridHeight: number; size: number | undefined }>`
  overflow: hidden;

  display: grid;

  padding: ${(gap / 3) * 1.5}px;
  gap: ${gap / 3}px;

  ${({ gridHeight, size }) =>
    size
      ? css`
          width: ${size}px;
          min-width: ${size}px;
          max-width: ${size}px;
          height: ${size}px;
          min-height: ${size}px;
          max-height: ${size}px;
        `
      : css`
          width: 100%;
          /* max-width: ${MAX_SIZE}px; */

          height: ${gridHeight}px;
          min-height: ${gridHeight}px;
          max-height: ${MAX_SIZE}px;
        `}

  /* min-width: ${MIN_SIZE}px; */
  /* min-height: ${MIN_SIZE}px; */

  /* image-rendering: smooth; */

  border-radius: 1rem;

  /* background-color: white; */
  background-color: ${({ theme }) => theme.colors.surface.main};

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
  /* background-color: ${({ theme }) => theme.colors.surface.main}; */
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
  data?: GeneSkill[];
  drop: DropProps;
  setDrop: React.Dispatch<React.SetStateAction<DropProps>>;
  setDropSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  geneBuild: GeneSkill[];
  setGeneBuild: React.Dispatch<React.SetStateAction<GeneSkill[]>>;

  className?: string;

  size?: number;
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

// console.log(gridElements);

const BingoBoard = ({
  geneBuild,
  setGeneBuild,
  drop,
  setDrop,
  setDropSuccess,
  className,
  size,
}: BingoBoardProps) => {
  // STATE:
  const [isDragging, setIsDragging] = useState(false);
  const [dragGene, setDragGene] = useState<GeneSkill | null>(null);
  // const [geneBuild, setGeneBuild] = useState<MonstieGene[]>(clean(EMPTY_BOARD));
  const [slotRefs, setSlotRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [outerGrid, setOuterGrid] = useState<GridElement[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver({ ref: containerRef });
  const gridWidth = containerRef.current?.getBoundingClientRect().width || 0;

  // DERIVED STATE:
  const boardLength = geneBuild.length;

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

  const placeGene = (targetIndex: number, gene: GeneSkill) =>
    setGeneBuild((genes) => {
      // housekeeping:
      const i = genes.findIndex(({ gId }) => gId === gene.gId);
      const copy = [...genes];
      let success = true;

      // the droppedGene is already on the board:
      if (i !== -1) success = false;
      // place the gene at the target location:
      else place(targetIndex, gene, copy);

      setDropSuccess(success);
      return copy;
    });

  const swapGenes = (targetIndex: number, gene: GeneSkill) =>
    setGeneBuild((genes) => {
      // housekeeping:
      const i = genes.findIndex(({ gId }) => gId === gene.gId);
      const copy = [...genes];

      // dragged from another board component so a swap isnt possible:
      if (i === -1) place(targetIndex, gene, copy);
      // swap the two elements in question:
      else swap(i, targetIndex, copy);

      setDropSuccess(true);
      return copy;
    });

  const shuffle = () => setGeneBuild((list) => clean(shuffleArray([...list])));

  useEffect(() => {
    // setGeneBuild(cleanGeneBuild);
  }, []);

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
    const attackTypes = geneBuild
      .map(({ attackType }, i) => attackType)
      // .map(({ attackType }, i) => (attackType === "" ? i : attackType))
      .filter((v) => v !== undefined);

    const elementTypes = geneBuild
      .map(({ elementType }, i) => elementType)
      .filter((v) => v !== undefined);

    const attackTypeBingos = findBingosInFlatArray(attackTypes).map(
      (bingo) => ({
        ...bingo,
        location: `a-${bingo.location}`,
      })
    );

    const elementTypeBingos = findBingosInFlatArray(elementTypes).map(
      (bingo) => ({
        ...bingo,
        location: `e-${bingo.location}`,
      })
    );

    const arr: GridElement[] = [];
    attackTypeBingos.forEach((bingo) =>
      arr.push({ gridArea: bingo.location, type: bingo.type })
    );
    elementTypeBingos.forEach((bingo) =>
      arr.push({ gridArea: bingo.location, type: bingo.type })
    );

    setOuterGrid(arr);
  }, [geneBuild]);

  return (
    <>
      <Grid
        ref={containerRef}
        className={className}
        gridHeight={gridWidth}
        size={size}
      >
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
        <GeneGridCell>
          <SlotGrid>
            {[...Array(9).keys()].map((_, i) => (
              <GeneSlot ref={slotRefs[i]} key={i} index={i} />
            ))}
          </SlotGrid>

          <GeneGrid>
            <AnimateSharedLayout>
              {geneBuild.map((gene, i) =>
                !isBlankGene(gene) ? (
                  <DraggableGene
                    key={gene.gId}
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
                  <EmptySlot key={gene.gId} />
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
