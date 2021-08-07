// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { MonstieGene } from "../utils/ProjectTypes";

const Container = styled.div``;

export type GeneBuild = {
  buildId: string;
  buildName: string;
  monstie: string;
  geneBuild: MonstieGene[];
};

type MonstieGeneBuildProps = {};

const MonstieGeneBuild = ({}: MonstieGeneBuildProps) => {
  return <Container></Container>;
};

export default MonstieGeneBuild;
