// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";

// data:
import DATA from "../utils/output.json";

// custom components:
import Table from "../components/Table";
import MonstieList from "../components/MonstieList";
import DraggableGene from "../components/DraggableGene";
import { TEST_BOARD } from "../utils/TestData";
import FloatingPoint from "../components/FloatingPoint";
import { useUIState } from "../contexts/UIContext";

const Container = styled.div`
  /* width: 100%; */
  /* height: 100%; */

  position: relative;

  display: flex;
  flex-direction: column;

  /* border: 1px solid red; */

  /* padding: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    padding: 0;
  } */
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
  /* justify-content: center; */
  /* align-items: center; */
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

  /* z-index: 9999; */
  /* position: fixed; */
  /* margin: 3rem; */
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

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    top: calc(${({ theme }) => theme.dimensions.mainNav.maxHeight}px + 1rem);
  }
`;

const QuickLinkMonstieList = styled(QuickLinkCompare)`
  top: 5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    top: calc(${({ theme }) => theme.dimensions.mainNav.maxHeight}px + 4rem);
  }
`;

const MonstiesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useUIState();

  const floatPointOffset = isMobile ? 10.5 : 28;

  const [lvl, setLvl] = useState(1);
  const [data, setData] = useState(DATA.monsties);
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
    const stats = DATA.monsties;
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

  const handleDragStart = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    console.log(info);
  };

  return (
    <>
      <Container ref={containerRef}>
        <QuickLinkCompare href="#compare">C</QuickLinkCompare>
        <Heading id="compare">Compare {"->"}</Heading>

        <FloatingPoint
          parentContainerRef={containerRef}
          bottom={floatPointOffset}
          right={floatPointOffset}
          portalId="floating-point-monstie-list"
        />

        <SurfaceContainer>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            doloremque quis laborum qui. Quibusdam quis aliquam nesciunt est
            enim commodi rerum, repellat consectetur recusandae eveniet non
            facilis odit corrupti, error necessitatibus animi omnis nostrum!
            Nostrum, officia nobis. Inventore provident fugiat, enim autem dicta
            assumenda earum tenetur temporibus eos impedit, pariatur qui
            excepturi atque. Quos eveniet est, temporibus architecto dolor,
            similique nobis cupiditate neque minima, suscipit rerum. Sint,
            obcaecati ipsum fugit, illo hic cupiditate magnam quo sapiente
            itaque enim aspernatur est eum, eligendi accusamus vero aut quam
            ducimus. Ab iure in molestiae tenetur fugiat, laboriosam debitis
            earum exercitationem quibusdam magni consectetur.
          </p>
        </SurfaceContainer>
        <SurfaceContainer>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            doloremque quis laborum qui. Quibusdam quis aliquam nesciunt est
            enim commodi rerum, repellat consectetur recusandae eveniet non
            facilis odit corrupti, error necessitatibus animi omnis nostrum!
            Nostrum, officia nobis. Inventore provident fugiat, enim autem dicta
            assumenda earum tenetur temporibus eos impedit, pariatur qui
            excepturi atque. Quos eveniet est, temporibus architecto dolor,
            similique nobis cupiditate neque minima, suscipit rerum. Sint,
            obcaecati ipsum fugit, illo hic cupiditate magnam quo sapiente
            itaque enim aspernatur est eum, eligendi accusamus vero aut quam
            ducimus. Ab iure in molestiae tenetur fugiat, laboriosam debitis
            earum exercitationem quibusdam magni consectetur.
          </p>
        </SurfaceContainer>
        <SurfaceContainer>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            doloremque quis laborum qui. Quibusdam quis aliquam nesciunt est
            enim commodi rerum, repellat consectetur recusandae eveniet non
            facilis odit corrupti, error necessitatibus animi omnis nostrum!
            Nostrum, officia nobis. Inventore provident fugiat, enim autem dicta
            assumenda earum tenetur temporibus eos impedit, pariatur qui
            excepturi atque. Quos eveniet est, temporibus architecto dolor,
            similique nobis cupiditate neque minima, suscipit rerum. Sint,
            obcaecati ipsum fugit, illo hic cupiditate magnam quo sapiente
            itaque enim aspernatur est eum, eligendi accusamus vero aut quam
            ducimus. Ab iure in molestiae tenetur fugiat, laboriosam debitis
            earum exercitationem quibusdam magni consectetur.
          </p>
        </SurfaceContainer>
        <SurfaceContainer>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Dignissimos eveniet sint ipsa eaque quas libero dolores nobis,
            maiores, inventore aut voluptates incidunt illum! Ipsum accusantium
            reiciendis, reprehenderit corrupti dolores quisquam sapiente
            exercitationem repellendus eligendi, nemo voluptatibus ducimus
            numquam temporibus blanditiis optio tempora doloremque incidunt?
            Nihil tempora ducimus fuga est vero suscipit hic nobis iste, itaque
            rerum dolor error maiores distinctio ullam fugit officia pariatur
            cupiditate. Magnam, consequuntur totam, tenetur sed unde voluptates
            deleniti rem, ducimus atque nostrum ratione! Aliquid rem soluta
            veritatis quaerat adipisci error veniam corrupti. Itaque, quaerat
            voluptatem. Maxime ut assumenda temporibus dolore saepe iste vitae
            excepturi eos consequatur, ullam nam, magnam dicta totam
            exercitationem accusantium magni molestiae quis placeat non rerum?
            Quidem delectus fuga odio, similique voluptates perspiciatis maiores
            eaque quasi culpa aperiam, veritatis dolore pariatur nobis expedita
            cum sed nesciunt natus fugiat provident doloribus obcaecati.
            Quibusdam fugiat, at commodi quisquam et quam enim maxime est odit
            illo illum praesentium repellat laboriosam facilis, aperiam eligendi
            iste. Itaque placeat odit corporis atque sit, accusamus consequuntur
            nisi porro harum non numquam voluptatibus dolore sapiente libero et
            saepe aliquid eum distinctio modi quas. Provident iure similique
            placeat autem, assumenda nihil ipsa, amet vitae architecto dolorem
            ipsum vel libero neque deleniti perferendis minus laborum atque
            explicabo mollitia! Accusamus vel omnis voluptatem saepe ad!
            Architecto repellat illo numquam deleniti nemo dicta eaque explicabo
            debitis excepturi ullam, voluptatum facilis consequuntur voluptas
            optio tempore ab sunt! Cupiditate officia facere, rem nostrum ut
            minus laudantium quasi cumque distinctio quis fuga ipsam, corporis
            dolores molestias, eveniet quibusdam similique nisi odio qui quos
            quidem. Nostrum rerum iure quia ut, minus tempore, maxime neque,
            quas cumque qui est aliquid esse minima illum laborum commodi
            incidunt quasi velit. Praesentium at totam quidem perferendis quae
            veniam neque vero, ut consequatur, modi debitis voluptates rem est
            nihil mollitia doloribus fugit eos alias iste quibusdam quam eum
            asperiores aspernatur! Magnam accusamus accusantium alias
            temporibus, odio praesentium? Exercitationem, dolorem quaerat
            doloribus error assumenda pariatur voluptatem similique aut velit
            quo et quisquam, ab repellat unde, est autem. Mollitia quae
            doloribus at quis cum voluptas ex quidem sapiente nostrum impedit
            nemo esse voluptate numquam praesentium corrupti vero doloremque
            voluptates incidunt eos molestias sint, omnis error sequi? Voluptate
            doloribus, reiciendis accusamus placeat officia reprehenderit iure
            tempora maxime possimus sequi distinctio aliquid molestias
            doloremque repudiandae illum hic id consequuntur odit praesentium
            minus aut! Neque veritatis error deserunt at modi, porro odit
            reprehenderit, illo fugit animi eligendi, quisquam earum sed dolor
            hic nihil sequi in. Esse velit inventore, quo voluptates omnis
            aliquam, dolor aspernatur corporis fugiat reprehenderit quis
            veritatis. Iure incidunt sed corporis eligendi laboriosam magnam
            delectus consectetur fuga aperiam facilis mollitia, molestiae velit
            earum fugiat cumque odit error officia voluptatibus architecto
            laudantium, porro vero debitis nisi qui. Hic amet perferendis
            aliquam laborum magnam nihil sint ipsum, unde dolor. Numquam harum
            labore nihil obcaecati libero a ipsam eius porro deleniti modi,
            ratione itaque vel odio excepturi nesciunt ut possimus corporis id
            quam sint consectetur vitae! Modi aut, quos est repudiandae
            voluptate repellat tempore cum, architecto, deleniti ipsum tenetur.
          </p>
        </SurfaceContainer>

        <QuickLinkMonstieList href="#monstie-list">M</QuickLinkMonstieList>
        <Heading id="monstie-list">Monstie List {"->"}</Heading>
        <MonstieList data={data} column={column} />

        {/* <Table data={data} column={column} /> */}
      </Container>
    </>
  );
};

export default MonstiesPage;
