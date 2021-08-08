// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ELEMENT_COLOR, MonstieGene } from "../utils/ProjectTypes";
import {
  GENE_SIZE_LETTER,
  isBlankGene,
  removeSizeFromName,
} from "../utils/utils";
import Asset from "./AssetComponents";
import BlankSkillCard from "./BlankSkillCard";

const EC = ELEMENT_COLOR;

const Container = styled.div``;

const SkillContainer = styled.div<{ bg?: string }>`
  min-height: 12rem;
  border-radius: 1rem;
  padding: 1rem;
  gap: 0.5rem;

  background: ${({ theme, bg }) =>
    `linear-gradient(125deg, ${bg} 54.7%, ${theme.colors.surface.main} 55%)`};

  display: flex;
  flex-direction: column;
`;

const GroupContainer = styled.div`
  display: flex;

  align-items: center;

  gap: 0.5rem;
  /* margin-bottom: 1rem; */
`;

const Name = styled.h3`
  /* margin-left: 0.5rem; */
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;

  flex: 1;
`;

const Desc = styled.div<{ bg: string }>`
  overflow: hidden;
  /* background-color: ${({ theme }) => theme.colors.surface.main}; */

  /* opacity: 0.9; */
  border-radius: 0.5rem;
  padding: 0.75rem;

  margin-top: auto;

  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-style: italic;
  /* font-weight: 600; */
  /* font-size: 1.2rem; */
  /* white-space: nowrap; */

  /* margin-bottom: 1rem; */

  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;

    z-index: 0;

    width: 100%;
    height: 100%;
    background-color: ${({ bg }) => bg};
    /* opacity: 0.1; */
  }
`;

const Bubble = styled.h5<{ bg?: string; bgDark?: string }>`
  position: relative;

  width: min-content;
  height: 2rem;
  padding: 0 0.8rem;

  overflow: hidden;

  border-radius: 10rem;

  background-color: ${({ bg }) => bg};
  color: ${({ theme }) => theme.colors.onPrimary.main};

  white-space: nowrap;
  text-transform: capitalize;
  font-size: 0.9rem;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  span {
    white-space: nowrap;
    font-size: 0.7rem;
    text-transform: uppercase;

    font-weight: 700;
    margin-right: 0.5rem;

    color: ${({ bgDark }) => bgDark};
  }
`;

const FromBubble = styled(Bubble)`
  padding-right: 0.3rem;
`;

const DescText = styled.p`
  position: relative;
  z-index: 1;
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-size: 0.9rem;
  font-style: italic;
  /* font-weight: 600; */
`;

const GeneSize = styled.p`
  width: 1.5rem;
  height: 1.5rem;

  margin-left: 0.5rem;

  border-radius: 50%;

  background-color: white;

  color: black;
  font-size: 0.8rem;
  font-weight: 700;

  display: flex;
  justify-content: center;
  align-items: center;
`;

type SkillCardProps = {
  gene: MonstieGene;
};

const SkillCard = ({ gene }: SkillCardProps) => {
  const { main, light, dark } = ELEMENT_COLOR[gene.elementType];

  if (isBlankGene(gene)) return <BlankSkillCard />;

  return (
    <SkillContainer bg={main}>
      <GroupContainer>
        <Asset asset={gene.attackType} size={23} />
        <Name>{gene.skill.skillName}</Name>
        <Asset asset={gene.elementType} size={20} />
      </GroupContainer>

      <FromBubble bg={light} bgDark={dark}>
        <span>From</span>
        {removeSizeFromName(gene.geneName)}
        <GeneSize>{GENE_SIZE_LETTER[gene.geneSize]}</GeneSize>
      </FromBubble>

      <GroupContainer>
        <Bubble bg={light} bgDark={dark}>
          {gene.skill.skillType}
        </Bubble>
        <Bubble bg={light} bgDark={dark} title="NO DATA YET">
          <span>KP</span>
          {"0"}
        </Bubble>
        <Bubble bg={light} bgDark={dark}>
          <span>Lvl</span> {gene.requiredLvl}
        </Bubble>
      </GroupContainer>

      <Desc bg={dark}>
        <DescText>{gene.skill.desc}</DescText>
      </Desc>
    </SkillContainer>
  );
};

export default SkillCard;
