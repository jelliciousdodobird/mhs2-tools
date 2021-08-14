// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { MonstieGene } from "../utils/ProjectTypes";
import { encodeGeneBuildToBase64Url } from "../utils/utils";

const Container = styled.div``;

const P = styled.span`
  margin-left: 1rem;
  color: red;
`;

export type GeneBuild = {
  buildId: string;
  buildName: string;
  monstie: string;
  createdBy: string | null;
  geneBuild: MonstieGene[];
};

type MonstieGeneBuildProps = { build: GeneBuild };

const MonstieGeneBuild = ({ build }: MonstieGeneBuildProps) => {
  const { buildId, buildName, monstie, createdBy, geneBuild } = build;
  const encodedUrl = encodeGeneBuildToBase64Url(build);
  return (
    <Container>
      <Link to={`/builds/edit/${buildId}`}>
        {buildId}
        <P>{buildName}</P>
      </Link>
    </Container>
  );
};

export default MonstieGeneBuild;
