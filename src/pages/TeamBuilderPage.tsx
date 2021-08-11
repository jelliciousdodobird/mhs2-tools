// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useHistory } from "react-router-dom";

//hooks:
import useDrop from "../hooks/useDrop";

// custom component:
import BingoBoard from "../components/BingoBoard";
import GeneSearch from "../components/GeneSearch";
import FloatingPoint from "../components/FloatingPoint";
import { useUIState } from "../contexts/UIContext";
import { MonstieGene } from "../utils/ProjectTypes";
import MonstieGeneBuild, { GeneBuild } from "../components/MonstieGeneBuild";
// import { FAB } from "../components/MonstieList";

// icons:
import { MdAdd } from "react-icons/md";
import Gutter from "../components/Gutter";
import FloatingActionButton from "../components/FloatingActionButton";

const Container = styled.div`
  /* border: 2px dashed green; */

  position: relative;

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    align-items: center;
  }
`;

const Heading = styled.h2`
  font-weight: 700;

  font-size: 3rem;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
`;

const CreateFAB = styled(FloatingActionButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const TeamBuilderPage = () => {
  // STATE:
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropSuccess, setDropSuccess] = useState(false);
  const { drop, setDrop } = useDrop();
  const { isMobile } = useUIState();

  const history = useHistory();

  const [builds, setBuilds] = useState<GeneBuild[]>([]);

  // DERIVED STATE:
  const floatPointOffset = isMobile ? 10.5 : 28;

  return (
    <Gutter>
      <Container ref={containerRef}>
        <Heading>Gene Builds</Heading>
        {/* <BingoBoard
          drop={drop}
          setDrop={setDrop}
          setDropSuccess={setDropSuccess}
        /> */}

        {builds.map((build) => (
          <MonstieGeneBuild key={build.buildId} />
        ))}

        <FloatingPoint
          parentContainerRef={containerRef}
          bottom={floatPointOffset}
        >
          <CreateFAB
            type="button"
            onClick={() => {
              history.push(`/builds/edit/${nanoid()}`);
            }}
          >
            <MdAdd />
          </CreateFAB>
        </FloatingPoint>
      </Container>
    </Gutter>
  );
};

export default TeamBuilderPage;
