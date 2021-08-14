// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useHistory } from "react-router-dom";
import base64url from "base64url";

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
import { useAuth } from "../contexts/AuthContext";
import { cleanGeneBuild } from "../utils/utils";
import { GENE_BUILDS } from "../utils/LocalStorageKeys";

const Container = styled.div`
  /* border: 2px dashed green; */

  position: relative;

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    /* align-items: center; */
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
  right: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    bottom: 0;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.s + 1}px) {
    top: 0;
  }
`;

const CreateBuildButton = styled.button`
  width: 100%;
`;

const BLANK_BOARD = cleanGeneBuild([]);

const createGeneBuild = (userId: string | null): GeneBuild => ({
  buildId: nanoid(),
  buildName: "",
  monstie: "",
  createdBy: userId,
  geneBuild: BLANK_BOARD,
});

const TeamBuilderPage = () => {
  // STATE:
  const { user } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dropSuccess, setDropSuccess] = useState(false);
  const { drop, setDrop } = useDrop();
  const { isMobile } = useUIState();

  const history = useHistory();

  const [builds, setBuilds] = useState<GeneBuild[]>([]);

  useEffect(() => {
    console.log(user);

    if (user) {
      // perform query
    } else {
      const data = window.localStorage.getItem("gene-builds") || "";
      setBuilds(data ? JSON.parse(data) : []);
    }
  }, []);

  useEffect(() => {
    if (user) {
    } else {
      window.localStorage.setItem("gene-builds", JSON.stringify(builds));
    }
  }, [builds]);

  // DERIVED STATE:
  // const floatPointOffset = isMobile ? 10.5 : 28;
  const floatPointOffset = isMobile ? { bottom: 10.5 } : { top: 28 };

  const shrinkData = (build: GeneBuild) => {
    const { buildId, buildName, createdBy, monstie, geneBuild } = build;
    const a = JSON.stringify({
      i: buildId,
      b: buildName,
      c: createdBy,
      m: monstie,
      g: geneBuild.map((gene) => gene.geneNumber),
    });

    return a;
  };

  return (
    <Gutter>
      <Container ref={containerRef}>
        <Heading
          onClick={() => {
            const data = JSON.parse(
              window.localStorage.getItem(GENE_BUILDS) || "null"
            );

            const str = shrinkData(data[0]);

            const encode1 = btoa(str);
            const decode1 = atob(encode1);

            console.log(encode1);
            console.log(decode1);

            const encode2 = Buffer.from(str).toString("base64");
            const decode2 = Buffer.from(encode2, "base64").toString();

            console.log(encode2);
            console.log(decode2);

            const encode3 = base64url("ldskjfidsjfijsliejf");
            const decode3 = base64url.decode("lskdjflkjsdf");

            console.log(encode3);
            console.log(decode3);

            console.log(
              "------------\n",
              encode1 === encode2,
              decode1 === decode2
            );
          }}
        >
          Gene Builds
        </Heading>
        <Heading>{user?.id}</Heading>

        {/* <BingoBoard
          drop={drop}
          setDrop={setDrop}
          setDropSuccess={setDropSuccess}
        /> */}

        {builds.length === 0 && <p>Your builds looking a bit empty..</p>}

        {builds.map((build) => (
          <MonstieGeneBuild key={build.buildId} build={build} />
        ))}

        <FloatingPoint parentContainerRef={containerRef} {...floatPointOffset}>
          <CreateFAB
            type="button"
            onClick={() => {
              const newBuild = createGeneBuild(user ? user.id : null);

              console.log(newBuild);

              const oldBuilds =
                window.localStorage.getItem(GENE_BUILDS) || "[]";

              window.localStorage.setItem(
                "gene-builds",
                JSON.stringify([...JSON.parse(oldBuilds), newBuild])
              );

              history.push(`/builds/edit/${newBuild.buildId}`);
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
