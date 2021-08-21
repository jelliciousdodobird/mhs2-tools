// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { Link, match } from "react-router-dom";
import React, { useEffect, useMemo, useState, useRef, memo } from "react";
import { useHistory } from "react-router-dom";

import debounce from "lodash/debounce";

//hooks:
import useDrop from "../hooks/useDrop";

// custom component:
import BingoBoard from "../components/BingoBoard";
import GeneSearch from "../components/GeneSearch";
import FloatingPoint from "../components/FloatingPoint";

import { useUIState } from "../contexts/UIContext";
import { GeneSkill, Skill } from "../utils/ProjectTypes";
import MonstieGeneBuild, { GeneBuild } from "../components/MonstieGeneBuild";
import {
  BLANK_GENE,
  cleanGeneBuild,
  CLEAN_EMPTY_BOARD,
  decodeBase64UrlToGeneBuild,
  DEFAULT_MONSTER,
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
import { saveUserBuild } from "../utils/db-inserts";
import supabase from "../utils/supabase";
import { sanitizeGeneSkill } from "../utils/db-transforms";
import { RiFundsFill } from "react-icons/ri";
import DynamicPortal from "../components/DynamicPortal";
import { MdClose, MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import BuildPageNotification from "../components/BuildPageNotification";
import { useCallback } from "react";
import MonsterSelect from "../components/MonsterSelect";

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

const HeaderContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column;
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
  font-weight: 700;
  font-size: 2rem;

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

const BackLink = styled(Link)`
  margin-left: 0.2rem;

  width: 100%;
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: white;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
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

export type BuildMetaInfo = {
  buildType: "user" | "local" | "anon" | "invalid";
  isCreator: boolean;
};

const BuildPage = memo(({ match }: PageProps) => {
  const { user } = useAuth();
  // STATE:
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDirty, setIsDirty] = useState(false);

  // DATA STATE:
  const [geneBuild, setGeneBuild] = useState<GeneSkill[]>(CLEAN_EMPTY_BOARD);
  const [buildName, setBuildName] = useState("");
  const [monstie, setMonstie] = useState(DEFAULT_MONSTER.mId);

  // COMPONENT STATE:
  const [buildMetaData, setBuildMetaData] = useState<BuildMetaInfo>({
    buildType: "invalid",
    isCreator: false,
  });

  const [loading, setLoading] = useState(true);

  const [dropSuccess, setDropSuccess] = useState(false);
  const { drop, setDrop } = useDrop();
  const { isMobile } = useUIState();

  const boardSize = isMobile ? undefined : 400;

  // DERIVED STATE:
  const floatPointOffset = isMobile ? 10.5 : 28;
  const buildId = match.params.id;

  const shuffle = () => setGeneBuild((list) => shuffleArray([...list]));
  const clearBuild = () => setGeneBuild(CLEAN_EMPTY_BOARD);

  const findLocalBuild = (targetBuildId: string) => {
    const allLocalBuilds: GeneBuild[] | null = JSON.parse(
      window.localStorage.getItem(GENE_BUILDS) || "null"
    );

    if (allLocalBuilds)
      return allLocalBuilds.find((build) => build.buildId === targetBuildId);
    else return null;
  };

  const saveToLocalStorage = (newData: GeneBuild) => {
    const allLocalBuilds: GeneBuild[] | null = JSON.parse(
      window.localStorage.getItem(GENE_BUILDS) || "null"
    );

    if (allLocalBuilds) {
      const buildIndex = allLocalBuilds.findIndex(
        (builds) => builds.buildId === buildId
      );

      const arr =
        buildIndex !== -1
          ? [
              ...allLocalBuilds.slice(0, buildIndex),
              ...allLocalBuilds.slice(buildIndex + 1, allLocalBuilds.length),
            ]
          : allLocalBuilds;

      const t = [...arr, newData];

      window.localStorage.setItem(GENE_BUILDS, JSON.stringify(t));

      setIsDirty(false);
    }
  };

  const save = (build: GeneBuild) => {
    if (build.createdBy) {
      saveUserBuild(build);
    } else saveToLocalStorage(build);
  };

  const debouncedSave = useCallback(debounce(save, 1000), []);

  useEffect(() => {
    const buildId = match.params.id;

    const fetch = async () => {
      setLoading(true);
      let validUserBuild = false;
      let validLocalBuild = false;
      let validAnonBuild = false;

      // 1. see if a user build exists for the current buildId:
      const { data, error } = await supabase
        .from("buildinfo")
        .select("*")
        .eq("build_id", buildId);
      if (data && !error) validUserBuild = data.length > 0;
      else if (error) console.error(error);

      // 2. see if a local build exists for the current buildId:
      validLocalBuild = !!findLocalBuild(buildId);

      // 3. see if a anon build exists for the current buildId:
      validAnonBuild = !(await decodeBase64UrlToGeneBuild(buildId)).error;

      // SET BUILD META DATA:
      // NOTE: that isCreator is tightly coupled with the type of build
      // this is because of how we omit creator_id when saving to local storage
      if (validUserBuild)
        setBuildMetaData({
          buildType: "user",
          isCreator: data?.[0].creator_id === user?.id,
        });
      else if (validLocalBuild)
        setBuildMetaData({ buildType: "local", isCreator: true });
      else if (validAnonBuild)
        setBuildMetaData({ buildType: "anon", isCreator: false });
      else setBuildMetaData({ buildType: "invalid", isCreator: false });

      setLoading(false);
    };

    fetch();
  }, [match.params.id, user]);

  useEffect(() => {
    const buildId = match.params.id;

    ///////////////////////////////// USER BUILD /////////////////////////////////
    if (buildMetaData.buildType === "user") {
      const fetchBuild = async () => {
        const { data, error } = await supabase
          .from("buildinfo")
          .select(
            "*, buildpieces:buildpiece(place, g_id, gene:genes(*, skill:skills(*)))"
          )
          // .eq("creator_id", user?.id)
          .eq("build_id", buildId)
          .order("place", {
            foreignTable: "buildpiece",
            ascending: true,
          });

        if (error) console.error(error);

        if (data?.length === 0) {
          // setLoading(false);
        }

        if (data && data.length > 0) {
          const res = data[0];
          const build = {
            buildId: res.build_id,
            buildName: res.build_name,
            monstie: res.monstie,
            createdBy: res.creator_id,
            geneBuild: cleanGeneBuild(
              res.buildpieces.map((bp: any) => {
                return sanitizeGeneSkill({
                  ...bp.gene,
                  skill: bp.gene?.skill[0],
                });
              })
            ),
          };

          setBuildName(build.buildName);
          setMonstie(build.monstie);
          setGeneBuild(build.geneBuild);
        }

        setLoading(false);
      };

      fetchBuild();
    }
    ///////////////////////////////// LOCAL BUILD /////////////////////////////////
    else if (buildMetaData.buildType === "local") {
      const localBuild = findLocalBuild(buildId);

      setBuildName(localBuild?.buildName || "");
      setMonstie(localBuild?.monstie || 33);
      setGeneBuild(cleanGeneBuild(localBuild?.geneBuild || []));

      setLoading(false);
    }
    ///////////////////////////////// ANON BUILD /////////////////////////////////
    else if (buildMetaData.buildType === "anon") {
      const fetchAnonBuild = async () => {
        const { error, build: anonBuild } = await decodeBase64UrlToGeneBuild(
          buildId
        );

        setBuildName(anonBuild.buildName);
        setMonstie(anonBuild.monstie);
        setGeneBuild(anonBuild.geneBuild);

        setLoading(false);
      };

      fetchAnonBuild();
    }
    ///////////////////////////////// INVALID BUILD /////////////////////////////////
    else {
      setLoading(false);
    }
  }, [match.params.id, buildMetaData, user]);

  useEffect(() => {
    const { isCreator } = buildMetaData;

    if (isCreator) {
      debouncedSave({
        buildId,
        buildName,
        monstie,
        geneBuild,
        createdBy: user ? user.id : null,
      });
    }
  }, [buildName, monstie, geneBuild, buildId, user, buildMetaData]);

  if (loading)
    return (
      <Gutter>
        <div>LOADING</div>
      </Gutter>
    );

  if (buildMetaData.buildType === "invalid")
    return (
      <Gutter>
        <div>invalid url</div>
      </Gutter>
    );

  return (
    <>
      <BuildPageNotification
        metaInfo={buildMetaData}
        editButtonAction={() => {
          console.log("yes");
        }}
      />
      <Gutter>
        <Container ref={containerRef}>
          <BackLink to="/builds">&lt;- Back to your build list</BackLink>
          <HeaderContainer>
            <BuildNameInput
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              maxLength={40}
              placeholder="Build name"
              disabled={!buildMetaData.isCreator}
            />
            <MonsterSelect value={monstie} setValue={setMonstie} />
          </HeaderContainer>
          {/* <Heading>The Magene {"->"}</Heading> */}

          <SubContainer>
            <BoardSection size={boardSize}>
              {/* <ButtonContainer>
                <Button onClick={clearBuild}>Clear</Button>
                <Button onClick={shuffle}>Random</Button>
                <SaveButton isDirty={isDirty}>Save</SaveButton>
              </ButtonContainer> */}
              <SubHeading>Bingoboard</SubHeading>

              <BingoBoard
                size={boardSize}
                geneBuild={geneBuild}
                setGeneBuild={setGeneBuild}
                drop={drop}
                setDrop={setDrop}
                setDropSuccess={setDropSuccess}
                disabled={!buildMetaData.isCreator}
              />

              <SubHeading>Bonuses</SubHeading>
              <BingoBonuses geneBuild={geneBuild} showBingosOnly={false} />
            </BoardSection>

            <SkillsSection>
              <SubHeading>Skills</SubHeading>
              <SkillsList geneBuild={geneBuild} />
            </SkillsSection>
          </SubContainer>

          <ObtainablesSection>
            <SubHeading>Hunt List</SubHeading>
            <ObtainableGeneList />
          </ObtainablesSection>

          {buildMetaData.isCreator && (
            <FloatingPoint
              parentContainerRef={containerRef}
              bottom={floatPointOffset}
            >
              <GeneSearch
                setDrop={setDrop}
                setDropSuccess={setDropSuccess}
                dropSuccess={dropSuccess}
              />
            </FloatingPoint>
          )}
        </Container>
      </Gutter>
    </>
  );
});

export default BuildPage;
