// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { useState, useMemo, useEffect, useRef } from "react";

// data:
import MONSTIES_DATA from "../utils/monsties.json";

// custom components:
import MonstieList from "../components/MonstieList";
import FloatingPoint from "../components/FloatingPoint";
import Gutter from "../components/Gutter";

// custom hooks:
import { useUIState } from "../contexts/UIContext";
import supabase from "../utils/supabase";

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  /* border: 1px dashed blue; */
`;

const SurfaceContainer = styled.div`
  /* border: 1px solid yellow; */
  position: relative;
  padding: 2rem;
  margin-bottom: 1rem;

  p {
    user-select: none;
  }

  /* width: 100%; */

  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
`;

const Heading = styled.h2`
  font-weight: 700;

  font-size: 3rem;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
`;

const QuickLinkCompare = styled.a`
  z-index: 10;

  align-self: flex-end;
  position: sticky;

  top: 2rem;
  right: 0;

  border-radius: 50%;
  width: 2rem;
  height: 2rem;

  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;

  box-shadow: 0px 0px 20px 0px ${({ theme }) => theme.colors.primary.main};
  box-shadow: 0px 0px 20px -10px black;
  /* background: ${({ theme }) =>
    `linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}; */

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: ${({ theme }) => theme.colors.onPrimary.main};
    }
  }

  top: calc(${({ theme }) => theme.dimensions.mainNav.maxHeight}px + 2rem);
`;

const QuickLinkMonstieList = styled(QuickLinkCompare)`
  top: calc(${({ theme }) => theme.dimensions.mainNav.maxHeight}px + 4rem);
`;

const CompareSection = styled(Gutter)`
  /* background-color: red; */
`;

const MonstieListSection = styled(Gutter)``;

const Test = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  text-transform: capitalize;
`;

const Row = styled.div`
  min-height: 20rem;
  width: 100%;

  border: 1px dashed red;

  display: flex;
`;

const Item = styled.div`
  border: 1px dashed yellow;

  flex-grow: 1;
  /* min-height: 100%; */
`;

const MonstiesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useUIState();

  const floatPointOffset = isMobile ? 10.5 : 28;

  const [lvl, setLvl] = useState(1);
  const [data, setData] = useState(MONSTIES_DATA);
  const column = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        width: 150,
      },
      { key: "type", label: "Type", width: 90 },
      { key: "ability1", label: "Ability 1", width: 100 },
      { key: "ability2", label: "Ability 2", width: 100 },
      { key: "speed", label: "Sp", width: 50 },

      { key: "hp", label: "HP", width: 50 },
      { key: "recovery", label: "Rec", width: 60 },

      { key: "atk_non-elemental", label: "Non Elemental Attack", width: 50 },
      { key: "atk_fire", label: "Fire Attack", width: 50 },
      { key: "atk_water", label: "Water Attack", width: 50 },
      { key: "atk_thunder", label: "Thunder Attack", width: 50 },
      { key: "atk_ice", label: "Ice Attack", width: 50 },
      { key: "atk_dragon", label: "Dragon Attack", width: 50 },

      { key: "def_non-elemental", label: "Non Elemental Defense", width: 50 },
      { key: "def_fire", label: "Fire Defense", width: 50 },
      { key: "def_water", label: "Water Defense", width: 50 },
      { key: "def_thunder", label: "Thunder Defense", width: 50 },
      { key: "def_ice", label: "Ice Defense", width: 50 },
      { key: "def_dragon", label: "Dragon Defense", width: 50 },
    ],
    []
  );

  useEffect(() => {
    const stats = MONSTIES_DATA;
    const newStats = stats.map((monstie, i) => {
      // const lvlStats = [];

      const statline = monstie.stats.find((statline) => statline.lvl === lvl);

      return {
        ...monstie,
        lvl: statline?.lvl,
        hp: statline?.hp,
        recovery: statline?.recovery,

        "atk_non-elemental": statline?.attack["non-elemental"],
        atk_fire: statline?.attack.fire,
        atk_water: statline?.attack.water,
        atk_thunder: statline?.attack.thunder,
        atk_ice: statline?.attack.ice,
        atk_dragon: statline?.attack.dragon,

        "def_non-elemental": statline?.defense["non-elemental"],
        def_fire: statline?.defense.fire,
        def_water: statline?.defense.water,
        def_thunder: statline?.defense.thunder,
        def_ice: statline?.defense.ice,
        def_dragon: statline?.defense.dragon,
      };
    });

    setData(newStats);
  }, [lvl]);

  const c = async () => {
    let { data: gene_skills, error } = await supabase
      .from("gene_skills")
      .select("*");

    return gene_skills;
  };
  useEffect(() => {}, []);

  return (
    <>
      <CompareSection>
        <Container
          onClick={async () => {
            console.log("yo");
            console.log(await c());
          }}
        >
          <QuickLinkCompare href="#compare">C</QuickLinkCompare>
          <Heading id="compare">Compare {"->"}</Heading>
          <SurfaceContainer>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem doloremque quis laborum qui. Quibusdam quis aliquam
              nesciunt est enim commodi rerum, repellat consectetur recusandae
              eveniet non facilis odit corrupti, error necessitatibus animi
              omnis nostrum! Nostrum, officia nobis. Inventore provident fugiat,
              enim autem dicta assumenda earum tenetur temporibus eos impedit,
              pariatur qui excepturi atque. Quos eveniet est, temporibus
              architecto dolor, similique nobis cupiditate neque minima,
              suscipit rerum. Sint, obcaecati ipsum fugit, illo hic cupiditate
              magnam quo sapiente itaque enim aspernatur est eum, eligendi
              accusamus vero aut quam ducimus. Ab iure in molestiae tenetur
              fugiat, laboriosam debitis earum exercitationem quibusdam magni
              consectetur.
            </p>
          </SurfaceContainer>
          <SurfaceContainer>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem doloremque quis laborum qui. Quibusdam quis aliquam
              nesciunt est enim commodi rerum, repellat consectetur recusandae
              eveniet non facilis odit corrupti, error necessitatibus animi
              omnis nostrum! Nostrum, officia nobis. Inventore provident fugiat,
              enim autem dicta assumenda earum tenetur temporibus eos impedit,
              pariatur qui excepturi atque. Quos eveniet est, temporibus
              architecto dolor, similique nobis cupiditate neque minima,
              suscipit rerum. Sint, obcaecati ipsum fugit, illo hic cupiditate
              magnam quo sapiente itaque enim aspernatur est eum, eligendi
              accusamus vero aut quam ducimus. Ab iure in molestiae tenetur
              fugiat, laboriosam debitis earum exercitationem quibusdam magni
              consectetur.
            </p>
          </SurfaceContainer>{" "}
          <Test>negate 1-hit ko</Test>
        </Container>
      </CompareSection>

      <MonstieListSection>
        <Container ref={containerRef}>
          <FloatingPoint
            parentContainerRef={containerRef}
            bottom={floatPointOffset}
            portalId="floating-point-monstie-list"
          />
          <QuickLinkMonstieList href="#monstie-list">M</QuickLinkMonstieList>
          <Heading id="monstie-list">Monstie List {"->"}</Heading>
          <MonstieList data={data} column={column} />
          {/* <Table data={data} column={column} /> */}
        </Container>
      </MonstieListSection>
    </>
  );
};

export default MonstiesPage;
