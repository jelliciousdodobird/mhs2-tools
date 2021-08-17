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

import { ReactComponent as CatLogo1 } from "../assets/cat-logo-1.svg";
import { ReactComponent as CatLogo2 } from "../assets/cat-logo-2.svg";
import { ReactComponent as CatLogo3 } from "../assets/cat-logo-3.svg";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

const CatLogo3_ = styled(CatLogo3)`
  #ears,
  #mouth {
    path {
      /* fill: ${({ theme }) => theme.colors.primary.main}; */
    }
  }
`;

const tickVariants = {
  pressed: (isChecked: boolean) => ({ pathLength: isChecked ? 0.85 : 0.2 }),
  checked: { pathLength: 1 },
  unchecked: { pathLength: 0 },
};

const boxVariants = {
  hover: { scale: 1.05, strokeWidth: 60 },
  pressed: { scale: 0.95, strokeWidth: 35 },
  checked: { stroke: "#FF008C" },
  unchecked: { stroke: "#ddd", strokeWidth: 50 },
};

const MonstiesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useUIState();

  const [isChecked, setIsChecked] = useState(false);
  const pathLength = useMotionValue(0);
  const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1]);

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

      <Gutter>
        <Test>
          <CatLogo1 />
          <CatLogo2 />

          <motion.svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={false}
            animate={isChecked ? "checked" : "unchecked"}
            whileHover="hover"
            whileTap="pressed"
            onClick={() => setIsChecked(!isChecked)}
          >
            <motion.path
              d="M25.6753 48.349L26.171 47.9287L26.325 47.2972L34.1456 15.2125L46.698 38.3786L49.1815 42.9621L50.4009 37.8936L55.7351 15.722L70.4836 47.2921L70.6741 47.7001L71.0212 47.987C72.9001 49.5405 74.0905 50.7256 75.0235 51.8998C75.9435 53.0578 76.6626 54.2663 77.5534 55.9398C78.3956 57.9324 78.6994 59.0175 78.9845 61.067C79.3538 64.5687 78.5589 67.7984 77.2403 70.3647C76.763 71.2615 76.4578 71.7548 75.8442 72.6837C75.0943 73.7544 74.5752 74.3335 74.0359 74.935C73.9418 75.0399 73.8472 75.1454 73.7506 75.2544C72.0108 77.0187 70.9727 77.7814 68.9785 79.1664C65.3375 81.4372 63.2015 82.3075 59.1001 83.4799C54.8047 84.4934 52.4264 84.8285 48.0347 84.8398C42.4724 84.6187 39.4624 84.1269 34.0613 82.1881C31.7451 81.2269 30.5181 80.6158 28.3936 79.3096C26.1966 77.8429 25.1266 76.9819 23.4089 75.2142L23.3084 75.1108L23.2485 75.0647C23.2437 75.0598 23.2381 75.0541 23.2317 75.0476C23.1834 74.9983 23.1141 74.9243 23.0254 74.826C22.8492 74.6307 22.6279 74.3742 22.3981 74.098C21.905 73.5055 21.4993 72.9735 21.378 72.7747L21.3592 72.7438L21.3392 72.7136C19.844 70.4509 19.2437 69.1769 18.5288 66.6199C18.2632 65.3852 18.1604 64.7175 18.0945 63.4237C18.058 62.6509 18.0797 62.0216 18.181 61.0859C18.6317 58.1261 19.086 56.6016 20.7943 53.7905C22.3684 51.4403 23.3993 50.2787 25.6753 48.349Z"
              stroke="black"
              strokeWidth="6"
              variants={tickVariants}
              style={{ pathLength, opacity }}
              custom={isChecked}
            />
          </motion.svg>

          <motion.svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={false}
            animate={isChecked ? "checked" : "unchecked"}
            whileHover="hover"
            whileTap="pressed"
            onClick={() => setIsChecked(!isChecked)}
          >
            <motion.path
              id="Vector 12"
              d="M33.5181 11.0231C25.8491 23.517 24.5581 31.4453 24.9006 46.3983C22.3318 48.502 21.2031 49.7767 19.4752 52.1377C17.7166 54.8858 17.1222 56.4183 16.4589 59.1437C16.0423 61.3737 15.9905 62.6327 16.1953 64.8924C16.5923 67.8027 17.1797 69.2718 18.3853 71.7311C19.7417 74.1182 20.6491 75.2824 22.4662 77.1249C24.4241 78.9752 25.6662 80.0013 28.4532 81.6874C30.9585 83.0718 32.4923 83.8077 35.8495 84.9268C38.0262 85.5891 39.4117 85.9402 42.7693 86.4578C45.6637 86.7924 47.3131 86.8758 50.3076 86.8076C53.1037 86.6541 54.6658 86.4799 57.4352 85.9356C60.9342 85.1564 62.8007 84.5385 66.0178 83.0967C68.9561 81.6529 70.5858 80.6678 73.333 78.3974C75.2881 76.6273 76.2358 75.5858 77.6217 73.627C78.4111 72.4369 78.8153 71.7192 79.467 70.342C80.3204 68.2765 80.659 67.0858 80.964 64.8924C81.1148 63.3199 81.1433 62.433 80.964 60.8302C80.5132 57.7951 79.9929 56.1897 78.5377 53.4992C76.5534 50.3134 75.1636 48.7859 72.2985 46.423C72.8828 32.4761 71.6567 24.7015 63.6776 11.0023C55.0185 21.4245 52.0246 27.5849 48.6044 38.8997C44.9096 26.8794 41.5364 20.8115 33.5181 11.0231Z"
              stroke="black"
              variants={tickVariants}
              style={{ pathLength, opacity }}
              strokeWidth={8}
              custom={isChecked}
            />
          </motion.svg>
        </Test>
        <CatLogo3_ />

        <button
          type="button"
          onClick={() => {
            window.localStorage.clear();
          }}
        >
          CLEAR LOCAL STORAGE
        </button>
      </Gutter>

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
