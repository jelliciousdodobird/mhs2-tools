// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement, useState } from "react";

// assets:
import SvgWrapper from "./SvgWrapper";
import { ReactComponent as PowerSvg } from "../assets/power.svg";
import { ReactComponent as TechnicalSvg } from "../assets/technical.svg";
import { ReactComponent as SpeedSvg } from "../assets/speed.svg";

const iconSize = 36;
const Power = (
  <SvgWrapper svgComponent={PowerSvg} title="Power" size={iconSize} />
);
const Technical = (
  <SvgWrapper svgComponent={TechnicalSvg} title="Technical" size={iconSize} />
);
const Speed = (
  <SvgWrapper svgComponent={SpeedSvg} title="Speed" size={iconSize} />
);

const ELEMENT_COLOR = {
  "non-elemental": "#949494",
  fire: "#cb0000",
  water: "#234eaf",
  thunder: "#c7ae00",
  ice: "#07ade6",
  dragon: "#991ec7",
  "": "black",
};

const GENE_SIZE_COLOR: { [key: number]: string } = {
  1: "black",
  2: "gray",
  3: "#ebd557",
  4: "#b8f0fc",
  "-1": "black",
};

const ATTACK_TYPE_COLOR: { [key: string]: ReactElement } = {
  power: Power,
  technical: Technical,
  speed: Speed,
};

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

const SIZE = 100;

const GeneContainer = styled.div<{
  size: number | undefined;
  maxZIndex: boolean;
}>`
  user-select: none;
  position: relative;
  /* margin: 5px; */

  width: ${({ size }) => (size ? size : SIZE)}px;
  height: ${({ size }) => (size ? size : SIZE)}px;

  ${({ maxZIndex }) =>
    maxZIndex &&
    css`
      z-index: 999;
    `}
`;

const GeneOctagon = styled.div<{ bg: string }>`
  /* z-index: 10; */
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${({ bg }) => bg};

  transform: scale(0.85);

  clip-path: ${octagonCssString};
`;

const GeneBorder = styled.div<{ bg: string }>`
  /* z-index: 5; */

  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${({ bg }) => bg};

  clip-path: ${octagonCssString};
`;

const PowerType = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate3d(-50%, -50%, 0);
`;

const GeneName = styled.p`
  position: absolute;
  bottom: 8px;
  left: 50%;

  background-color: ${({ theme }) => theme.colors.onSurface.main};
  color: ${({ theme }) => theme.colors.background.main};

  padding: 2px 5px;
  border-radius: 3px;

  cursor: all-scroll;

  width: 100%;
  /* height: 1.6rem; */

  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 600;

  overflow: hidden;

  transform: translate3d(-50%, 0, 0);
`;

const SkillContainer = styled.div`
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

export type SkillType = "active" | "passive" | "";
export type AttackType = "power" | "technical" | "speed" | "";
export type ElementType =
  | "non-elemental"
  | "fire"
  | "water"
  | "thunder"
  | "ice"
  | "dragon"
  | "";

export type Skill = {
  skillName: string;
  skillType: SkillType;
  desc: string;
};

export type MonstieGene = {
  geneName: string;
  geneNumber: number;
  attackType: AttackType;
  elementType: ElementType;
  requiredLvl: number;
  geneSize: number;
  skill: Skill;
  possessedBy: { native: string[]; random: string[] };
};

type GeneProps = {
  gene: MonstieGene;
  size?: number;
};

const Gene = ({ gene, size }: GeneProps) => {
  const [showSkill, setShowSkill] = useState(false);

  return (
    <GeneContainer
      size={size}
      maxZIndex={showSkill}
      onMouseLeave={() => setShowSkill(false)}
      onClick={() => setShowSkill((v) => !v)}
    >
      <GeneBorder bg={GENE_SIZE_COLOR[gene.geneSize]} />
      <GeneOctagon bg={ELEMENT_COLOR[gene.elementType]}></GeneOctagon>
      <PowerType>{ATTACK_TYPE_COLOR[gene.attackType]}</PowerType>
      {gene.geneName && <GeneName>{gene.geneName}</GeneName>}
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
