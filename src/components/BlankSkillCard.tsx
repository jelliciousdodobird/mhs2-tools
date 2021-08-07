// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";
import { ELEMENT_COLOR, MonstieGene } from "../utils/ProjectTypes";
import { isBlankGene } from "../utils/utils";
import Asset from "./AssetComponents";
import color from "color";

const Container = styled.div`
  min-height: 12rem;
  border-radius: 1rem;
  padding: 1rem;

  background: ${({ theme }) =>
    `linear-gradient(125deg, ${theme.colors.surface.lighter} 54.7%, ${theme.colors.surface.main} 55%)`};

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RowContainer = styled.div`
  flex: 1;

  display: flex;
  gap: 0.5rem;
`;

const Bubble = styled.h5<{ w?: string; bg?: string }>`
  width: ${({ w }) => w};
  height: 2rem;
  padding: 0 1.1rem;

  overflow: hidden;

  border-radius: 10rem;

  background-color: ${({ theme }) =>
    theme.name === "dark" ? "#4b5561" : "#dadadc"};
`;

type BlankSkillCardProps = {};

const BlankSkillCard = ({}: BlankSkillCardProps) => {
  return (
    <Container>
      <Bubble w="10rem" />

      <RowContainer>
        <Bubble w="4rem" />
        <Bubble w="3rem" />
      </RowContainer>

      <Bubble w="100%" />
    </Container>
  );
};

export default BlankSkillCard;
