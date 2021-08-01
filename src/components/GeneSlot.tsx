// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement, forwardRef } from "react";
import { useDrop } from "react-dnd";
import { MonstieGene } from "../utils/ProjectTypes";
import { ELEMENT_COLOR } from "../utils/ProjectTypes";

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

const EC = ELEMENT_COLOR;

const rainbowGradient = (degree = 150) =>
  `repeating-linear-gradient(
    ${degree}deg,
    ${EC["fire"].main} 0%,
    ${EC["thunder"].main} 3%,
    #49d0b0 7%,
    ${EC["water"].main} 10%,
    ${EC["dragon"].main} 13%,
    ${EC["fire"].main} 15%
)`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  transform: scale(0.9);

  background-attachment: fixed;
  background-image: ${({ theme }) => rainbowGradient()};
`;

const SlotHole = styled.div<{ isOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 50%;

  transform: scale(0.85);

  background-color: ${({ theme }) => theme.colors.surface.main};

  /* background-color: ${({ isOver, theme }) =>
    isOver ? theme.colors.correct.main : theme.colors.background.main}; */

  /* border: 5px solid ${({ theme }) => theme.colors.background.main}; */

  /* clip-path: ${octagonCssString}; */

  display: flex;
  justify-content: center;
  align-items: center;
`;

type GeneSlotProps = {
  index: number;
  // updateBoard: (index: number, gene: MonstieGene) => void;
  // swapGenes: (initialIndex: number, targetIndex: number) => void;
  // swapGenes: (initialIndex: number, gene: MonstieGene) => void;
  // children?: ReactElement;
};

const GeneSlot = forwardRef<HTMLDivElement, GeneSlotProps>(({ index }, ref) => {
  return (
    <Container ref={ref}>
      <SlotHole isOver={false} />
    </Container>
  );
});

export default GeneSlot;
