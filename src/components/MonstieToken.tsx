import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import Den from "./Den";

import { ReactComponent as StarSVG } from "../assets/star.svg";

import { useState } from "react";

// import { ReactComponent as DenSVG } from "../assets/den.svg";
// import DenSVG from "../assets/den.svg";

const Container = styled.div<{ bg?: string }>`
  position: relative;

  // border: 1px solid white;

  width: 9rem;
  min-width: 9rem;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`;

const ImgContainer = styled.div<{ color: string; bg?: string }>`
  // background: ${({ theme }) => `${theme.colors.surface.lighter}`};
  // background: ${({ theme, bg }) =>
    `linear-gradient(120deg, ${bg} 50.7%, ${theme.colors.surface.lighter} 51%)`};
  background-color: rgba(255, 255, 255, 0.1);

  height: 9rem;
  width: 9rem;

  border-radius: 100%;

  border: 5px solid ${({ color }) => color};

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 0.8rem;
`;

const Icon = styled.img`
  width: 6rem;
  height: 6rem;
`;

const MainInfo = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 0.5rem;
`;

const ExtraInfo = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
`;
const Bubble = styled.div<{ color: string }>`
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 0.3rem;

  padding: 0.5rem;
  border-radius: 1rem;

  background-color: ${({ theme }) =>
    theme.name === "dark" ? "#4b5561" : "#dadadc"};
  // background-color: ${({ color }) => color};
  // border: 5px solid ${({ color }) => color};
`;

const Name = styled.h3`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
`;

// Gold Dens Only / Regular Dens Only
const Location = styled.h4`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  font-size: 0.9rem;
`;

type TokenProps = { className?: string; monstie: any };

// on click card highlight
const MonstieToken = ({ className, monstie }: TokenProps) => {
  const [egg, showEgg] = useState(false);
  // const Den = getDenSVG();

  return (
    <Container
      className={className}
      bg={monstie.color}
      onClick={() => showEgg(!egg)}
    >
      <ImgContainer color={monstie.color} bg={monstie.color}>
        <Icon src={egg ? monstie.egg : monstie.icon}></Icon>
      </ImgContainer>
      <MainInfo>
        <Bubble color={monstie.color}>
          <Name>{monstie.name}</Name>
        </Bubble>

        <Bubble color={monstie.color}>
          <Location>{monstie.location}</Location>
        </Bubble>
      </MainInfo>
      <ExtraInfo>
        <Den denType={monstie.den}></Den>
      </ExtraInfo>
    </Container>
  );
};

export default MonstieToken;
