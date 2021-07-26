// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { AnimateSharedLayout, motion } from "framer-motion";
import { createRef, Ref, RefObject, useEffect, useRef, useState } from "react";

// types:
import { MonstieGene } from "./Gene";
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
} from "../utils/utils";
import { DROP_TYPES } from "../utils/DropTypes";

const SLOT_SIZE = 110;

const Container = styled.div`
  position: relative;
  width: ${SLOT_SIZE * 3}px;
  height: ${SLOT_SIZE * 3}px;
`;

const gridStyles = () => css`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.5rem;
`;

const SlotGrid = styled(motion.div)`
  position: relative;
  background-color: ${({ theme }) => theme.colors.surface.main};

  ${gridStyles}
`;

const GeneGrid = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  ${gridStyles}
`;

const EmptySlot = styled.div``;

/////////////////////////////////////////////////////////////////////////////////

type BingoBoardProps = {
  data?: MonstieGene[];
  drop: DropProps;
  setDrop: React.Dispatch<React.SetStateAction<DropProps>>;
  setDropSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

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

  return (
    <>
      {/* <Debug data={board.map((gene) => gene.geneName)} drag /> */}
      <button type="button" onClick={shuffle}>
        shuffle
      </button>

      <Container>
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
      </Container>
    </>
  );
};

export default BingoBoard;
