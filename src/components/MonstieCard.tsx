// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// icons:
import { ImHeart } from "react-icons/im";
import { GiHealthNormal } from "react-icons/gi";
import { MdFastForward } from "react-icons/md";
import { randomNumber } from "../utils/utils";
import { rgba } from "emotion-rgba";
import { memo } from "react";
import { motion } from "framer-motion";
import { useUIState } from "../contexts/UIContext";
import color from "color";
import { ElementType, ELEMENT_COLOR } from "../utils/ProjectTypes";
import Egg from "./Egg";
import Asset from "./AssetComponents";
import { MonsterAtLvl } from "./MonstieList";

const Container = styled.div<{ bg: string }>`
  position: relative;

  background-color: ${({ bg, theme }) => (bg ? bg : theme.colors.surface.main)};

  background: ${({ theme, bg }) =>
    `linear-gradient(120deg, ${bg} 59.7%, ${theme.colors.surface.main} 60%)`};

  border-radius: 1rem;

  width: 100%;
  min-height: 14rem;
  max-height: 14rem;
  /* height: 10rem; */

  /* margin-right: 1rem; */
  /* margin-bottom: 1rem; */

  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RowContainer = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  gap: 0.4rem;
`;

const Name = styled.h3`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;

  /* margin-bottom: 1rem; */
`;

const Number = styled.h4`
  position: absolute;
  top: 0;
  right: 0;

  margin: 1rem;

  /* opacity: 0.15; */

  color: ${({ theme }) => rgba(theme.colors.onBackground.main, 0.2)};
  font-weight: 700;
`;

const Bubble = styled.h5`
  position: relative;
  /* width: 10rem; */
  width: min-content;
  height: 2rem;
  padding: 0 1.1rem;

  overflow: hidden;

  border-radius: 10rem;

  color: ${({ theme }) => theme.colors.onPrimary.main};
  white-space: nowrap;
  font-size: 0.9rem;

  display: flex;
  justify-content: center;
  align-items: center;

  /* margin-bottom: 0.5rem; */

  &::after {
    /* z-index: 0; */

    position: absolute;
    top: 0;
    left: 0;

    content: "";

    width: 100%;
    height: 100%;

    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const IMAGE_SIZE = 10;

const ImageHolder = styled.div<{ strokeColor: string }>`
  z-index: 1;
  /* border: 1px solid ${({ theme }) => theme.colors.onPrimary.main}; */

  position: absolute;
  bottom: 0rem;
  right: 0;

  margin: 1rem;

  border-radius: 10px 50% 50% 50%;
  /* border-radius: 50%; */

  width: ${IMAGE_SIZE}rem;
  height: ${IMAGE_SIZE}rem;

  background-color: ${({ theme }) =>
    theme.name === "light"
      ? `rgba(0, 0, 0, 0.05)`
      : `rgba(255, 255, 255, 0.1)`};

  /* background-color: ${({ theme }) => theme.colors.surface.main}; */
  border: 5px solid ${({ strokeColor }) => strokeColor};
  background-color: rgba(255, 255, 255, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Egg_ = styled(Egg)`
  /* position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -70%);

  width: 10rem;
  height: 10rem; */
`;

const Img = styled.img`
  /* width: 80%; */
  /* height: 80%; */
`;

const StatContainer = styled.div<{ bg: string }>`
  z-index: 0;
  position: relative;

  padding: 0 0.5rem;
  margin-top: auto;
  /* padding: 0 1rem; */

  width: min-content;
  width: 100%;
  height: 3rem;

  border-radius: 10rem;

  background-color: ${({ theme }) => theme.colors.surface.main};
  /* align-self: flex-end; */

  display: flex;
  /* justify-content: center; */
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: "";
    position: absolute;

    top: -16px;
    height: 16px;
    width: 12.5rem;
    /* border-radius: 2px; */

    background-color: ${({ bg }) => bg};
    clip-path: polygon(0 0, 100% 0, 94.5% 100%, 0% 100%);

    /* background-color: red; */
  }
`;

const Stat = styled.h4<{ bg?: string }>`
  position: relative;
  /* margin-left: 0.5rem; */

  width: 2rem;
  height: 2rem;

  border-radius: 50%;

  background-color: ${({ bg, theme }) => bg};

  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-size: 0.85rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const BaseStat = styled(Stat)<{ bg?: string }>`
  /* color: ${({ theme }) => theme.colors.onBackground.main}; */
  background-color: ${({ theme }) => rgba(theme.colors.onBackground.main, 0.2)};

  span {
    border-radius: 5rem;
    /* padding-right: 5px; */
    /* padding-left: 20px; */

    /* border-right: 5px solid ${({ bg }) => bg}; */
    /* border-left: 15px solid ${({ bg }) => bg}; */
    /* background-color: ${({ bg }) => bg}; */
    color: ${({ theme }) => theme.colors.onPrimary.main};

    position: absolute;
    top: -20px;
    left: 50%;

    text-transform: uppercase;
    font-size: 0.7rem;
    font-weight: 600;

    transform: translate3d(-50%, 0, 0);
  }
`;

const AttackTypeIcon = styled(Asset)`
  svg {
    path,
    circle {
      fill: white;
    }
  }
`;

// type Monster = {
//   mId: number;
//   monster_name: string;
//   elementStrength: ElementType;
//   elementWeakness: ElementType;
// }

type MonstieCardProps = {
  monster: MonsterAtLvl;
  showEgg?: boolean;
};

const MonstieCard = ({ monster, showEgg = false }: MonstieCardProps) => {
  const { isMobile } = useUIState();
  const { elementStrength, elementWeakness } = monster;

  const stengthElementColor =
    ELEMENT_COLOR[elementStrength as ElementType].main;
  const weaknessElementColor =
    ELEMENT_COLOR[elementWeakness as ElementType].main;
  const dark = ELEMENT_COLOR[elementStrength as ElementType].light;
  const has2ndAbility = monster.ability2 !== "---";
  const spacing = { marginBottom: "1.2rem" };

  return (
    <Container
      bg={stengthElementColor}
      // key={monster.name + monster.strength}
      // notice that the shuffle animation is turned off by setting layoutId = undefined
      // layoutId={isMobile ? undefined : monstie.name + monstie.strength}
      onClick={() => {
        console.log(monster);
        console.log(monster.elementStrength);
      }}
    >
      <RowContainer>
        <AttackTypeIcon
          asset={monster.attackType?.toLowerCase()}
          title={monster.attackType}
          size={20}
        />
        <Name>{monster.monsterName}</Name>
      </RowContainer>

      <Number>#{monster.mId}</Number>
      {monster.ability1 && (
        <Bubble style={!has2ndAbility ? spacing : {}}>
          {monster.ability1}
        </Bubble>
      )}
      {monster.ability2 && has2ndAbility && (
        <Bubble style={spacing}>{monster.ability2}</Bubble>
      )}
      <ImageHolder strokeColor={dark}>
        {showEgg ? (
          <Egg_
            patternType={monster.eggPatternType}
            bgColor={monster.eggBgColor}
            patternColor={monster.eggPatternColor}
          />
        ) : (
          <Img
            src={`https://nvbiwqsofgmscfcufpfd.supabase.in/storage/v1/object/public/monster-img/${monster.imgUrl}`}
          />
        )}
      </ImageHolder>
      <StatContainer bg={stengthElementColor}>
        <Stat bg={stengthElementColor} title="Strongest Attack Stat">
          {monster[`atk_${elementStrength}` as "atk_fire"]}
        </Stat>

        <Stat bg={weaknessElementColor} title="Weakest Defense Stat">
          {monster[`def_${elementWeakness}` as "atk_fire"]}
        </Stat>

        <BaseStat bg={stengthElementColor}>
          <span>hp</span>
          {monster.hp}
        </BaseStat>

        <BaseStat bg={stengthElementColor}>
          <span>rec</span>
          {monster.recovery}
        </BaseStat>

        <BaseStat bg={stengthElementColor}>
          <span>sp</span>
          {monster.speed}
        </BaseStat>
      </StatContainer>
    </Container>
  );
};

export default MonstieCard;
