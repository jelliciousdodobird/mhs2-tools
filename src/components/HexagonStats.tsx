// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import DATA from "../utils/output.json";
import { createElement, Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const hexSize = 200;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  margin: 2rem;

  width: ${hexSize}px;
  height: ${hexSize}px;

  /* overflow: auto; */
`;

const HexContainer = styled.div`
  /* background-color: ${({ theme }) => theme.colors.onSurface.main}; */
  background-color: ${({ theme }) => theme.colors.background.main};

  width: 100%;
  height: 100%;
  /* clip-path: polygon(26% 10%, 74% 10%, 100% 50%, 74% 90%, 26% 90%, 0% 50%); */
  clip-path: ${({ polygon }: { polygon: string }) => polygon};
`;

const HexValue = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.primary.main};

  width: 100%;
  height: 100%;

  width: ${hexSize}px;
  height: ${hexSize}px;
  /* clip-path: polygon(26% 10%, 74% 10%, 100% 50%, 74% 90%, 26% 90%, 0% 50%); */
  clip-path: ${({ polygon }: { polygon: string }) => polygon};
`;

const Title = styled.h2`
  z-index: 10;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);

  color: ${({ theme }) => theme.colors.onPrimary.main};

  text-transform: uppercase;
  font-weight: 600;
`;

const Label = styled.h3`
  position: absolute;
  top: 0;
  left: 0;

  color: black;
  /* font-weight: 600; */

  transform: translate3d(-50%, -50%, 0);
  ${({ position }: { position: { x: number; y: number } }) => css`
    left: ${position.x}%;
    top: ${position.y}%;
  `};
`;

const dotSize = 6;

const Dot = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};

  background-color: ${({ theme }) => theme.colors.surface.main};

  transform: translate3d(-50%, -50%, 0);
  ${({ position }: { position: { x: number; y: number } }) => css`
    left: ${position.x}%;
    top: ${position.y}%;
  `};

  &:hover {
    /* border: 1px solid ${({ theme }) => theme.colors.background.main}; */
    border: 0;
    background-color: ${({ theme }) => theme.colors.onSurface.main};

    width: ${dotSize * 2}px;
    height: ${dotSize * 2}px;
  }
`;

// top left , top right , middle right , bottom right , bottom left , middle left
const MAX_VERTICES = [
  { x: 26, y: 10 },
  { x: 74, y: 10 },
  { x: 100, y: 50 },
  { x: 74, y: 90 },
  { x: 26, y: 90 },
  { x: 0, y: 50 },
];

const shiftVertices = (vertices: any, shiftAmt: number) =>
  vertices.map((vertex: any) => ({
    ...vertex,
    x: vertex.x + shiftAmt,
    y: vertex.y + shiftAmt,
  }));

const normalizeVertices = (vertices: any) => shiftVertices(vertices, -50);
const unNormalizeVertices = (vertices: any) => shiftVertices(vertices, 50);

const createStatVertices = (hexStats: any, max: number) => {
  const vertices = [
    { x: 0, y: 0, label: "", value: 0, xMax: 0, yMax: 0 },
    { x: 0, y: 0, label: "", value: 0, xMax: 0, yMax: 0 },
    { x: 0, y: 0, label: "", value: 0, xMax: 0, yMax: 0 },
    { x: 0, y: 0, label: "", value: 0, xMax: 0, yMax: 0 },
    { x: 0, y: 0, label: "", value: 0, xMax: 0, yMax: 0 },
    { x: 0, y: 0, label: "", value: 0, xMax: 0, yMax: 0 },
  ];

  const normalizedMaxVertices = normalizeVertices(MAX_VERTICES);

  hexStats.forEach((vertex: any, i: number) => {
    const { label, value } = vertex;

    const scalar = value / max;
    const maxVertex = normalizedMaxVertices[i];

    vertices[i] = { ...vertex };

    vertices[i].label = label;
    vertices[i].value = value;
    vertices[i].x = maxVertex.x * scalar;
    vertices[i].y = maxVertex.y * scalar;
    vertices[i].xMax = maxVertex.x * 1.15 + 50;
    vertices[i].yMax = maxVertex.y * 1.15 + 50;
  });

  return unNormalizeVertices(vertices);
};

const generateCssHexagonString = (vertices: any) => {
  return `polygon(${vertices[0].x}% ${vertices[0].y}%, ${vertices[1].x}% ${vertices[1].y}%, ${vertices[2].x}% ${vertices[2].y}%, ${vertices[3].x}% ${vertices[3].y}%, ${vertices[4].x}% ${vertices[4].y}%, ${vertices[5].x}% ${vertices[5].y}%)`;
};

export type HexagonStatsProps = {
  hexStats: any;
  title?: string;
  max?: number;
};

const animationProps = {
  variants: {
    open: {
      scale: 1,
      transition: { delay: 0.1 },
    },
    close: {
      scale: 0,
    },
  },
  initial: "close",
  animate: "open",
  exit: "close",
};

const HexagonStats = ({ hexStats, title, max = 10 }: HexagonStatsProps) => {
  const [value, setValue] = useState(-1);
  const statVertices = createStatVertices(hexStats, max);
  const cssPolygonString = generateCssHexagonString(statVertices);
  const containerPolygonString = generateCssHexagonString(MAX_VERTICES);

  return (
    <Container>
      <HexContainer polygon={containerPolygonString}></HexContainer>
      <Title>{value === -1 ? title : value}</Title>
      <AnimatePresence>
        <HexValue polygon={cssPolygonString} {...animationProps} />
      </AnimatePresence>

      {statVertices.map((vertex: any) => (
        <Fragment key={vertex.x + vertex.y}>
          <Dot
            position={{ x: vertex.x, y: vertex.y }}
            onMouseEnter={() => {
              setValue(vertex.value);
            }}
            onMouseLeave={() => setValue(-1)}
          />

          <Label
            position={{ x: vertex.xMax, y: vertex.yMax }}
            title={vertex.label + " " + max}
          >
            {vertex.componentLabel ? vertex.componentLabel : vertex.label}
          </Label>
        </Fragment>
      ))}
    </Container>
  );
};

export default HexagonStats;
