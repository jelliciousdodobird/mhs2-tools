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

const ELEMENT_COLOR = {
  non_elemental: "#949494",
  fire: "#fc6c6d",
  water: "#76befe",
  thunder: "#ffd76f",
  ice: "#a8e9ff",
  dragon: "#d04fff",
  rainbow: "pink",
  "": "black",
};

type ElementType = keyof typeof ELEMENT_COLOR;

const Container = styled.div<{ bg: string }>`
  position: relative;

  background-color: ${({ bg, theme }) => (bg ? bg : theme.colors.surface.main)};

  background: ${({ theme, bg }) =>
    `linear-gradient(130deg, ${bg} 59.7%, ${theme.colors.surface.main} 60%)`};

  border-radius: 1rem;

  width: 100%;
  /* height: 10rem; */

  /* margin-right: 1rem; */
  /* margin-bottom: 1rem; */

  padding: 1rem;

  display: flex;
  flex-direction: column;
`;

const Name = styled.h3`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;

  margin-bottom: 1rem;
`;

const Number = styled.h4`
  position: absolute;
  top: 0;
  right: 0;

  margin: 1rem;

  /* opacity: 0.15; */

  color: ${({ theme }) => rgba(theme.colors.onBackground.main, 0.1)};
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

  margin-bottom: 0.5rem;

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

const IMAGE_SIZE = 6.5;

const ImageHolder = styled.div`
  z-index: 1;

  position: absolute;
  bottom: 0rem;
  right: 0;

  margin: 1rem;

  border-radius: 10px 50px 50px 50px;

  width: ${IMAGE_SIZE}rem;
  height: ${IMAGE_SIZE}rem;

  background-color: ${({ theme }) =>
    theme.name === "light"
      ? `rgba(0, 0, 0, 0.05)`
      : `rgba(255, 255, 255, 0.1)`};
`;

const StatContainer = styled.div<{ bg: string }>`
  position: relative;

  margin-top: auto;
  /* padding: 0 1rem; */

  width: 100%;
  height: 3rem;

  border-radius: 10rem;

  background-color: ${({ theme }) => theme.colors.surface.main};
  /* align-self: flex-end; */

  display: flex;
  /* justify-content: center; */
  align-items: center;

  &::before {
    content: "";
    position: absolute;

    top: -16px;
    height: 16px;
    width: 12.5rem;
    border-radius: 2px;

    background-color: ${({ bg }) => bg};
  }
`;

const Stat = styled.h4<{ bg?: string }>`
  position: relative;
  margin-left: 0.5rem;

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
  /* background-color: none; */

  background-color: red;
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

  /* span {
    color: ${({ theme }) => theme.colors.onBackground.main};
    font-size: 0.85rem;
    position: relative;
    z-index: 1;
  } */

  /* svg {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate3d(-50%, -50%, 0);

    width: 2.3rem;
    height: 2.3rem;

    path {
      fill: ${({ theme }) => theme.colors.background.darker};
    }
  } */
`;

type MonstieCardProps = {
  monstie: any;
};

const MonstieCard = memo(({ monstie }: MonstieCardProps) => {
  const { strength, weakness } = monstie;

  const strength_element = ELEMENT_COLOR[strength as ElementType];
  const weakness_element = ELEMENT_COLOR[weakness as ElementType];
  const has2ndAbility = monstie.ability2 !== "---";

  const spacing = { marginBottom: "1.2rem" };

  return (
    <Container bg={strength_element}>
      <Name>{monstie.name}</Name>
      <Number>#{randomNumber(0, 88)}</Number>
      {monstie.ability1 && (
        <Bubble style={!has2ndAbility ? spacing : {}}>
          {monstie.ability1}
        </Bubble>
      )}
      {monstie.ability2 && has2ndAbility && (
        <Bubble style={spacing}>{monstie.ability2}</Bubble>
      )}
      <ImageHolder></ImageHolder>
      <StatContainer bg={strength_element}>
        <Stat bg={strength_element} title="Strongest Attack Stat">
          {monstie[`atk_${strength}`]}
        </Stat>
        <Stat bg={weakness_element} title="Weakest Defense Stat">
          {monstie[`def_${weakness}`]}
        </Stat>
        <BaseStat bg={strength_element}>
          <span>hp</span>
          {monstie.hp}
          {/* <ImHeart /> */}
        </BaseStat>

        <BaseStat bg={strength_element}>
          <span>rec</span>
          {monstie.recovery}

          {/* <GiHealthNormal /> */}
        </BaseStat>
        <BaseStat bg={strength_element}>
          <span>sp</span>
          {monstie.speed}
          {/* <MdFastForward /> */}
        </BaseStat>
      </StatContainer>
    </Container>
  );
});

export default MonstieCard;
