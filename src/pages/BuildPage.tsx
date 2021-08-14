// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { match } from "react-router-dom";
import React, { useEffect, useMemo, useState, useRef } from "react";
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
import {
  cleanGeneBuild,
  decodeBase64UrlToGeneBuild,
  encodeGeneBuildToBase64Url,
  shuffleArray,
} from "../utils/utils";
import useGeneBuild from "../hooks/useGeneBuild";
import TextInput from "../components/TextInput";
import { rainbowGradient } from "../components/GeneSlot";
import { ELEMENT_COLOR as EC } from "../utils/ProjectTypes";
import BingoBonuses from "../components/BingoBonuses";
import ObtainableGeneList from "../components/ObtainableGeneList";
import SkillsList from "../components/SkillsList";
import Gutter from "../components/Gutter";
import { useAuth } from "../contexts/AuthContext";
import { GENE_BUILDS } from "../utils/LocalStorageKeys";

export const rainbowTextGradient = (degree = 150) =>
  `repeating-linear-gradient(
    ${degree}deg,
    ${EC["fire"].main} ,
    ${EC["thunder"].main} ,
    #49d0b0 ,
    ${EC["water"].main} ,
    ${EC["dragon"].main} ,
    ${EC["fire"].main}
)`;

const Container = styled.div`
  /* border: 2px dashed green; */
  position: relative;

  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;

  /* padding-bottom: 10rem; */

  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    align-items: center;
  }

  &::after {
    content: "";

    /* background-color: #fff; */
    width: 100%;
    /* height: 100%; */
    min-height: 20rem;
  }
`;

const SubContainer = styled.div`
  display: flex;

  width: 100%;

  flex-wrap: wrap;

  min-height: 400px;

  gap: 3rem;
  /* justify-content: space-between; */
`;

const Section = styled.section`
  /* border: 1px dashed red; */

  flex: 1;

  width: 100%;

  min-width: 200px;

  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

const BoardSection = styled(Section)<{ size: number | undefined }>`
  min-width: ${({ size }) => (size ? size : 300)}px;
  max-width: ${({ size }) => size}px;
`;

const BingoSection = styled(Section)`
  min-width: 20rem;
  max-width: 25rem;
`;

const SkillsSection = styled(Section)`
  /* overflow: auto; */

  /* flex: 2; */
  min-width: 21.5rem;

  /* min-width: 400px; */
  /* max-width: 400px; */
`;

const ObtainablesSection = styled(Section)`
  /* min-width: 300px; */
  /* max-width: 400px; */
`;

const Heading = styled.h1`
  width: 100%;

  font-weight: 700;
  font-size: 3rem;

  /* margin-bottom: 1rem; */

  /* background: ${rainbowGradient()};
  background-attachment: fixed;
  background-clip: text;
  -webkit-text-fill-color: transparent; */

  /* -webkit-text-fill-color: */

  color: ${({ theme }) => theme.colors.onSurface.main};

  /* display: flex; */
`;

const headingHeight = 2.2;

const subHeadingStyles = (props: any) => css`
  color: ${props.theme.colors.onSurface.main};

  min-height: ${headingHeight}rem;
  font-weight: 600;
  font-size: 1.5rem;

  margin-left: 0.25rem;
`;

const BuildNameInput = styled(TextInput)`
  /* ${subHeadingStyles}
  min-width: 300px;
  max-width: 300px; */

  font-weight: 700;
  font-size: 3rem;

  /* background: ${rainbowGradient()};
  background-attachment: fixed;
  background-clip: text;
  -webkit-text-fill-color: transparent; */

  &::placeholder {
    color: inherit;
  }
`;

const SubHeading = styled.h2`
  ${subHeadingStyles}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;

  min-height: ${headingHeight}rem;
  border-radius: 5rem;

  background-color: ${({ theme }) => theme.colors.primary.main};

  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const SaveButton = styled(Button)<{ isDirty: boolean }>`
  ${({ isDirty, theme }) =>
    isDirty
      ? css`
          background-color: ${theme.colors.error.main};
        `
      : css``}
`;

type PageProps = {
  match: match<{ id: string }>;
};

// components with grid areas applied:
const BingoBoard_ = styled(BingoBoard)``;
const BingoBonuses_ = styled(BingoBonuses)``;
const ObtainableGeneList_ = styled(ObtainableGeneList)``;
const SkillsList_ = styled(SkillsList)``;

const BLANK_BOARD = cleanGeneBuild([]);

const BuildPage = ({ match }: PageProps) => {
  const { user } = useAuth();
  // STATE:
  const containerRef = useRef<HTMLDivElement>(null);

  const [geneBuild, setGeneBuild] = useState<MonstieGene[]>(BLANK_BOARD);
  const [isDirty, setIsDirty] = useState(false);
  const [buildName, setBuildName] = useState("");
  // const [buildId, setBuildId] = useState("");

  const [invalidBuildId, setInvalidBuildId] = useState(false);

  const [dropSuccess, setDropSuccess] = useState(false);
  const { drop, setDrop } = useDrop();
  const { isMobile } = useUIState();

  const boardSize = isMobile ? undefined : 400;

  // DERIVED STATE:
  const floatPointOffset = isMobile ? 10.5 : 28;
  const buildId = match.params.id;

  const shuffle = () => setGeneBuild((list) => shuffleArray([...list]));
  const clearBuild = () => setGeneBuild(BLANK_BOARD);

  const saveToLocalStorage = () => {
    const localData: GeneBuild[] | null = JSON.parse(
      window.localStorage.getItem(GENE_BUILDS) || "null"
    );

    if (localData) {
      const newData: GeneBuild = {
        buildId,
        buildName,
        createdBy: null,
        monstie: "",
        geneBuild,
      };

      const buildIndex = localData.findIndex(
        (builds) => builds.buildId === buildId
      );
      // console.log("b", build);

      const arr =
        buildIndex !== -1
          ? [
              ...localData.slice(0, buildIndex),
              ...localData.slice(buildIndex + 1, localData.length),
            ]
          : localData;

      const t = [...arr, newData];

      window.localStorage.setItem(GENE_BUILDS, JSON.stringify(t));

      setIsDirty(false);
    }
  };

  const saveToDatabase = () => {};

  const save = () => {
    if (user) saveToDatabase();
    else saveToLocalStorage();
  };

  useEffect(() => {
    const buildId = match.params.id;

    if (user) {
      // DO DATA FETCHING HERE
    } else {
      console.log(match.params.id);

      const localData: GeneBuild[] | null = JSON.parse(
        window.localStorage.getItem(GENE_BUILDS) || "null"
      );

      if (localData) {
        const build = localData.find((builds) => builds.buildId === buildId);
        console.log("b", build);

        if (build) {
          setGeneBuild(build.geneBuild);
          setBuildName(build.buildName);
        } else setInvalidBuildId(true);
      } else {
        // redirect cus invalid buildId
        setInvalidBuildId(true);
      }
    }
  }, [match]);

  useEffect(() => {
    setIsDirty(true);
  }, [geneBuild, buildName]);

  if (invalidBuildId)
    return (
      <Gutter>
        <p>INVALID ID</p>
      </Gutter>
    );

  return (
    <Gutter>
      <Container ref={containerRef}>
        {/* <Heading>The Magene {"->"}</Heading> */}
        <BuildNameInput
          value={buildName}
          onChange={(e) => setBuildName(e.target.value)}
          maxLength={40}
          placeholder="Build name"
        />

        <SubContainer>
          <BoardSection size={boardSize}>
            <ButtonContainer>
              <Button onClick={clearBuild}>Clear</Button>
              <Button onClick={shuffle}>Random</Button>
              <SaveButton isDirty={isDirty} onClick={save}>
                Save
              </SaveButton>
            </ButtonContainer>

            <BingoBoard_
              size={boardSize}
              geneBuild={geneBuild}
              setGeneBuild={setGeneBuild}
              drop={drop}
              setDrop={setDrop}
              setDropSuccess={setDropSuccess}
            />
            <BingoBonuses_ geneBuild={geneBuild} showBingosOnly={false} />
          </BoardSection>

          {/* <BingoSection>
            <SubHeading>Bingos</SubHeading>
            <BingoBonuses_ geneBuild={geneBuild} />
          </BingoSection> */}

          <SkillsSection>
            <SubHeading>Skills</SubHeading>
            <SkillsList_ geneBuild={geneBuild} />
          </SkillsSection>
        </SubContainer>

        <ObtainablesSection>
          <SubHeading>Hunt List</SubHeading>
          <ObtainableGeneList_ />
        </ObtainablesSection>

        <FloatingPoint
          parentContainerRef={containerRef}
          bottom={floatPointOffset}
        >
          <GeneSearch
            // genes={genes}
            setDrop={setDrop}
            setDropSuccess={setDropSuccess}
            dropSuccess={dropSuccess}
          />
        </FloatingPoint>
      </Container>
    </Gutter>
  );
};

export default BuildPage;

//  const saveToLocalStorage = () => {
//    const localData: string[] | null = JSON.parse(
//      window.localStorage.getItem(GENE_BUILDS) || "null"
//    );

//    if (localData) {
//      const newData: GeneBuild = {
//        buildId,
//        buildName,
//        createdBy: "",
//        monstie: "",
//        geneBuild,
//      };

//      const newBuildUrl = encodeGeneBuildToBase64Url(newData);

//      const buildIndex = localData.findIndex((url) => url === newBuildUrl);
//      // console.log("b", build);

//      const arr =
//        buildIndex !== -1
//          ? [
//              ...localData.slice(0, buildIndex),
//              ...localData.slice(buildIndex + 1, localData.length),
//            ]
//          : localData;

//      const t = [...arr, newData];

//      window.localStorage.setItem(GENE_BUILDS, JSON.stringify(t));

//      setIsDirty(false);
//    }
//  };

// useEffect(() => {
//   const buildUrl = match.params.id;

//   if (user) {
//     // DO DATA FETCHING HERE
//   } else {
//     console.log(match.params.id);

//     const localData: string[] | null = JSON.parse(
//       window.localStorage.getItem(GENE_BUILDS) || "null"
//     );

//     if (localData) {
//       const encodedUrl = localData.find((url) => url === buildUrl);

//       console.log("b", encodedUrl);

//       if (encodedUrl) {
//         const { build } = decodeBase64UrlToGeneBuild(encodedUrl);
//         setGeneBuild(build.geneBuild);
//         setBuildName(build.buildName);
//         setBuildId(build.buildId);
//       } else setInvalidBuildId(true);
//     } else {
//       // redirect cus invalid buildId
//       setInvalidBuildId(true);
//     }
//   }
// }, [match]);
