// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useState } from "react";

//hooks:
import useDrop from "../hooks/useDrop";

// custom component:
import BingoBoard from "../components/BingoBoard";

import GeneSearch from "../components/GeneSearch";
import FloatingPoint from "../components/FloatingPoint";
import { useRef } from "react";
import { useUIState } from "../contexts/UIContext";

const Container = styled.div`
  /* border: 2px dashed green; */

  position: relative;
  /* height: 100%; */
  /* width: 100%; */

  /* overflow: auto; */
  /* overflow-x: hidden; */

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    align-items: center;
  }

  /* background-color: ${({ theme }) => theme.colors.background.main}; */

  &::after {
    content: "";

    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
`;

const Heading = styled.h2`
  font-weight: 700;

  font-size: 3rem;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
`;

const w = "100%";
const h = "100px";

const D = styled.div`
  /* background-color: white; */
  border: 2px dashed white;

  width: ${w};
  min-width: ${w};

  height: ${h};
  min-height: ${h};
`;

const FloatingPoint2 = styled.div`
  border: 3px dashed red;
  position: fixed;

  right: 0;
  bottom: 0;

  margin: 2rem;

  /* transform: translateZ(0); */
  width: 100%;

  /* background-color: red; */
`;

const TeamBuilderPage = () => {
  const { drop, setDrop } = useDrop();
  const [dropSuccess, setDropSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useUIState();

  const floatPointOffset = isMobile ? 10.5 : 28;

  return (
    <>
      <Container ref={containerRef}>
        <Heading>Gene Magene</Heading>
        <BingoBoard
          drop={drop}
          setDrop={setDrop}
          setDropSuccess={setDropSuccess}
        />

        <FloatingPoint
          parentContainerRef={containerRef}
          bottom={floatPointOffset}
          right={floatPointOffset}
        >
          <GeneSearch
            // genes={genes}
            setDrop={setDrop}
            setDropSuccess={setDropSuccess}
            dropSuccess={dropSuccess}
          />
        </FloatingPoint>
      </Container>
    </>
  );
};

export default TeamBuilderPage;
