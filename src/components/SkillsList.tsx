// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import {
  ElementType,
  ELEMENT_COLOR,
  MonstieGene,
  SkillType,
} from "../utils/ProjectTypes";
import { isBlankGene } from "../utils/utils";
import Asset from "./AssetComponents";
import BlankSkillCard from "./BlankSkillCard";
import Debug from "./Debug";
import SkillCard from "./SkillCard";

const cardMinWidth = 20;
const minInPixels = cardMinWidth * 14;

const Container = styled.div<{ threeColumnView: boolean }>`
  /* border: 2px dashed red; */
  display: grid;
  gap: 1rem;
  /* grid-template-columns: repeat(auto-fit, minmax(21.5rem, 1fr)); */
  grid-template-columns: ${({ threeColumnView }) =>
    threeColumnView
      ? `repeat(3, minmax(${cardMinWidth}em, 1fr))`
      : `repeat(auto-fit, minmax(${cardMinWidth}rem, 1fr))`};

  /* background-color: ${({ theme }) => theme.colors.surface.main}; */
  /* padding: 1rem; */
  /* border-radius: 1rem; */

  width: 100%;
  height: 100%;
`;

type SkilsListProps = { className?: string; geneBuild: MonstieGene[] };

const SkillsList = ({ className, geneBuild }: SkilsListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: containerRef });

  const oneColumnWidth = cardMinWidth * 14 * 2 + 14;
  const twoColumnWidth = cardMinWidth * 14 * 3;
  const oneColumnView = width < oneColumnWidth;
  const twoColumnView = width < twoColumnWidth && width > oneColumnWidth;
  const threeColumnView = !(oneColumnView || twoColumnView);

  const list = threeColumnView
    ? geneBuild
    : geneBuild.filter((gene) => !isBlankGene(gene));

  const oneColumnExtraCards = useMemo(
    () => [...Array(Math.max(0, 4 - list.length)).keys()],
    [list]
  );

  const twoColumnExtraCards = useMemo(
    () => [...Array(Math.max(0, 6 - list.length)).keys()],
    [list]
  );

  return (
    <Container
      className={className}
      ref={containerRef}
      threeColumnView={threeColumnView}
    >
      {list.map((gene, i) => (
        <SkillCard key={gene.geneNumber} gene={gene} />
      ))}

      {oneColumnView &&
        oneColumnExtraCards.map((v) => <BlankSkillCard key={v} />)}
      {twoColumnView &&
        twoColumnExtraCards.map((v) => <BlankSkillCard key={v} />)}
    </Container>
  );
};

export default SkillsList;
