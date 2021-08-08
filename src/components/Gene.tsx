// styling:
import { css, keyframes, Theme, ThemeContext } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement, useState } from "react";

import color from "color";

// assets:

import Asset from "./AssetComponents";
import { ELEMENT_COLOR, ElementType, MonstieGene } from "../utils/ProjectTypes";
import { rgba } from "emotion-rgba";
import { motion } from "framer-motion";
import { formatGeneName, GENE_SIZE_LETTER } from "../utils/utils";

const GENE_SIZE_COLOR: { [key: string]: string } = {
  1: "black",
  2: "gray",
  3: "#ebd557",
  4: "#b8f0fc",
  "": "salmon",
};

// const GENE_SIZE_LETTER: { [key: string]: string } = {
//   1: "S",
//   2: "M",
//   3: "L",
//   4: "XL",
//   "": "",
// };

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

const GeneContainer = styled.div<{
  size: number | undefined;
  maxZIndex: boolean;
}>`
  user-select: none;
  position: relative;
  /* margin: 5px; */

  width: ${({ size }) => (size ? `${size}px` : "100%")};
  height: ${({ size }) => (size ? `${size}px` : "100%")};
  max-width: ${({ size }) => (size ? `${size}px` : "100%")};
  max-height: ${({ size }) => (size ? `${size}px` : "100%")};
  min-width: ${({ size }) => (size ? `${size}px` : "100%")};
  min-height: ${({ size }) => (size ? `${size}px` : "100%")};

  ${({ maxZIndex }) =>
    maxZIndex &&
    css`
      z-index: 999;
    `}
`;

const rainbowAnimation = keyframes`
  0%{background-position:0% 82%}
    50%{background-position:100% 19%}
    100%{background-position:0% 82%}
`;

const GeneOctagon = styled.div<{ c: string; rainbow: boolean }>`
  /* z-index: 10; */
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
  border-radius: 50%;

  background-color: ${({ c }) => c};
  clip-path: ${octagonCssString};
  /* transform: scale(0.8); */

  ${({ rainbow }) =>
    rainbow &&
    css`
      animation: ${rainbowAnimation} 10s linear infinite;
      background-size: 1800% 1800%;
      background-image: linear-gradient(
        90deg,
        #e81d1d,
        #e8b71d,
        #e3e81d,
        #1de840,
        #1ddde8,
        #2b1de8,
        #dd00f3,
        #dd00f3
      );
    `}
`;

const GeneBorder = styled.div<{ c: string }>`
  /* z-index: 5; */

  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${({ c }) => c};

  transform: scale(1.1);

  border-radius: 50%;

  /* clip-path: ${octagonCssString}; */
`;

const PowerType = styled.div<{ c?: string; rainbow: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate3d(-50%, -50%, 0);

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 90%;
      width: 90%;

      /* opacity: ${({ rainbow }) => (rainbow ? 1 : 1)}; */

      path,
      circle {
        fill: ${({ c, rainbow }) => (rainbow ? "white" : c)};
      }

      line {
        stroke: ${({ c, rainbow }) => (rainbow ? "white" : c)};
      }
    }
  }
`;

const GeneName = styled.p<{ c?: string; borderColor?: string }>`
  user-select: none;
  overflow: hidden;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);

  background-color: ${({ c }) => c};

  border-radius: 3px;
  height: 1.5rem;
  padding: 0.22rem 0;
  border-right: 0.5rem solid ${({ borderColor }) => borderColor};
  border-left: 0.5rem solid ${({ borderColor }) => borderColor};

  width: 100%;
  max-width: 100%;

  text-align: center;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;

  /* clip-path: polygon(11% 0, 89% 0, 100% 50%, 89% 100%, 11% 100%, 0% 50%); */
`;

const GeneSize = styled.p`
  user-select: none;

  position: absolute;
  top: 0;
  right: 0;

  width: 1.5rem;
  height: 1.5rem;

  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.onSurface.main};

  color: ${({ theme }) => theme.colors.surface.main};
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SkillContainer = styled.div`
  z-index: 999;
  position: absolute;
  left: 50%;
  bottom: 0;

  width: 300px;
  /* height: 100px; */
  min-height: 100px;
  transform: translate3d(-50%, 100%, 0);

  display: flex;
  flex-direction: column;

  &::before {
    margin-top: 2px;
    content: "";
    height: 6px;
    width: 100%;

    background-color: ${({ theme }) => theme.colors.onSurface.main};

    clip-path: polygon(50% 0, 48% 100%, 52% 100%);
  }
`;

const SkillDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.surface.main};

  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.onSurface.main};

  border-radius: 5px;

  padding: 0.5rem;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const SkillHeading = styled.span`
  display: flex;
  margin-bottom: 0.5rem;
`;

const Dot = styled.span`
  margin: 0 0.3rem;
`;

const SkillName = styled.p`
  font-weight: 700;
`;

const SkillType = styled.p`
  text-transform: capitalize;
`;

const SkillDesc = styled.p`
  font-style: italic;
`;

type GeneProps = {
  gene: MonstieGene;
  size?: number;
  disableSkillPreview?: boolean;
};

const Gene = ({ gene, size, disableSkillPreview = false }: GeneProps) => {
  // state:
  const [showSkill, setShowSkill] = useState(false);
  const [hover, setHover] = useState(false);

  // colors:
  const geneColor = ELEMENT_COLOR[gene.elementType as ElementType].main;
  const darkenGeneColor = ELEMENT_COLOR[gene.elementType as ElementType].dark;
  const borderColor = color(geneColor).darken(0.35).hex();

  // formatted strings:
  const geneSizeLetter = GENE_SIZE_LETTER[gene.geneSize];
  const formattedGeneName = formatGeneName(gene.geneName);

  // misc:
  const isRainbowGene = gene.geneName === "rainbow";

  return (
    <GeneContainer
      onMouseEnter={() => setHover(true)}
      size={size}
      maxZIndex={showSkill}
      onMouseLeave={() => {
        setShowSkill(false);
        setHover(false);
      }}
      onClick={() => {
        if (!disableSkillPreview) setShowSkill((v) => !v);
        // console.log(gene);
      }}
    >
      {/* <GeneBorder c={GENE_SIZE_COLOR[gene.geneSize]} /> */}
      <GeneOctagon c={geneColor} rainbow={isRainbowGene}></GeneOctagon>
      <PowerType c={darkenGeneColor} rainbow={isRainbowGene}>
        <Asset asset={gene.attackType} />
      </PowerType>
      {!isRainbowGene && (
        <>
          <GeneSize>{geneSizeLetter}</GeneSize>
          <GeneName c={darkenGeneColor} borderColor={borderColor}>
            {formattedGeneName}
          </GeneName>
        </>
      )}

      {showSkill && (
        <SkillContainer>
          <SkillDetails>
            <SkillHeading>
              <SkillName>{gene.skill.skillName} </SkillName>
              <Dot>&#8226;</Dot>
              <SkillType>{gene.skill.skillType}</SkillType>
            </SkillHeading>

            <SkillDesc>{gene.skill.desc}</SkillDesc>
          </SkillDetails>
        </SkillContainer>
      )}
    </GeneContainer>
  );
};

export default Gene;
