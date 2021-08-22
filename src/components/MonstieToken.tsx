import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import Den from "./Den";
import Egg from "./Egg";
import { ELEMENT_COLOR, ElementType } from "../utils/ProjectTypes";

import { ReactComponent as StarSVG } from "../assets/star.svg";

import { useState } from "react";

// import { ReactComponent as DenSVG } from "../assets/den.svg";
// import DenSVG from "../assets/den.svg";

const Container = styled.div<{ bg?: string; size: number }>`
  position: relative;

  width: ${({ size }) => `${size}px`};
  min-width: ${({ size }) => `${size}px`};

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`;

const ImgContainer = styled.div<{ color: string; bg?: string; size: number }>`
  background-color: ${({ theme }) =>
    theme.name === "light"
      ? `rgba(0, 0, 0, 0.05)`
      : `rgba(255, 255, 255, 0.1)`};

  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};

  border-radius: 100%;

  border: 5px solid ${({ color }) => color};

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 0.3rem;
`;

const Img = styled.img`
  width: 75%;
  height: 75%;
`;

const Egg_ = styled(Egg)`
  width: 90%;
  height: 90%;
`;

const MainInfo = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 0.3rem;
`;

const ExtraInfo = styled.div`
  position: absolute;
  top: 2%;
  right: 2%;
`;

const Bubble = styled.div<{ color: string }>`
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 0.3rem;

  padding: 0.2rem;
  border-radius: 1rem;

  background-color: ${({ theme }) =>
    theme.name === "dark" ? "#4b5561" : "#dadadc"};
`;

const Name = styled.h3`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 80%;
  text-align: center;
`;

// Gold Dens Only / Regular Dens Only
const Location = styled.h4`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 80%;
  text-align: center;
`;

type TokenProps = { className?: string; monstie: any; egg: any; size?: number };

const MonstieToken = ({ className, monstie, egg, size = 150 }: TokenProps) => {
  const [showEgg, setShowEgg] = useState(false);
  // const Den = getDenSVG();
  const strengthElementColor =
    ELEMENT_COLOR[monstie.elementStrength as ElementType].main;

  return (
    <Container
      className={className}
      bg={strengthElementColor}
      onClick={() => setShowEgg(!showEgg)}
      size={size}
    >
      <ImgContainer
        size={size}
        color={strengthElementColor}
        bg={strengthElementColor}
      >
        {showEgg ? (
          <Egg_
            patternType={egg.patternType}
            bgColor={egg.bgColor}
            patternColor={egg.patternColor}
          />
        ) : (
          <Img
            src={`https://nvbiwqsofgmscfcufpfd.supabase.in/storage/v1/object/public/monster-img/${monstie.imgUrl}`}
          />
        )}
      </ImgContainer>
      <MainInfo>
        <Bubble color={strengthElementColor}>
          <Name>{monstie.monsterName}</Name>
        </Bubble>

        <Bubble color={strengthElementColor}>
          <Location>
            {monstie.habitat === "" ? "Unknown" : monstie.habitat}
          </Location>
        </Bubble>
      </MainInfo>
      <ExtraInfo>{/* <Den denType={monstie.den}></Den> */}</ExtraInfo>
    </Container>
  );
};

export default MonstieToken;
