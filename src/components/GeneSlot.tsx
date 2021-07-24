// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import { useDrop } from "react-dnd";
import { MonstieGene } from "./Gene";

const octagonCssString = `polygon(
    50% 0,
    85% 15%,
    100% 50%,
    85% 85%,
    50% 100%,
    15% 85%,
    0 50%,
    15% 15%
  )`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlotHole = styled.div<{ isOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 50%;

  background-color: ${({ isOver, theme }) =>
    isOver ? theme.colors.correct.main : theme.colors.background.main};

  clip-path: ${octagonCssString};

  display: flex;
  justify-content: center;
  align-items: center;
`;

type GeneSlotProps = {
  index: number;
  updateBoard: (index: number, gene: MonstieGene) => void;
  // swapGenes: (initialIndex: number, targetIndex: number) => void;
  swapGenes: (initialIndex: number, gene: MonstieGene) => void;
  children?: ReactElement;
};

const GeneSlot = ({
  updateBoard,
  swapGenes,
  index,
  children,
}: GeneSlotProps) => {
  const [{ isOver, didDrop }, dropTargetRef] = useDrop({
    accept: ["gene", "gene-move"],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      didDrop: monitor.didDrop(),
    }),
    // drop: (props: { from: number; gene: MonstieGene }, monitor) => {
    drop: (props: MonstieGene, monitor) => {
      const itemType = monitor.getItemType();
      // console.log("-----");

      if (itemType === "gene") {
        // console.log("gene");
        updateBoard(index, props);
        // console.log(props.from);
      } else if (itemType === "gene-move") {
        // console.log("gene-move");
        // console.log(props.from);
        swapGenes(index, props);
      }
    },
  });
  return (
    <Container ref={dropTargetRef}>
      <SlotHole isOver={isOver} />
      {children}
    </Container>
  );
};

export default GeneSlot;
