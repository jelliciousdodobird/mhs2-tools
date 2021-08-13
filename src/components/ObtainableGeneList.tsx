// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

import MonstieToken from "./MonstieToken";

import CrimsonQurupecoIcon from "../assets/monstie.png";
import CrimsonQurupecoEgg from "../assets/CrimsonQurupecoEgg.svg";

const Container = styled.div`
  /* border: 2px dashed salmon; */

  background-color: ${({ theme }) => theme.colors.surface.main};
  padding: 1rem;
  border-radius: 1rem;

  width: 100%;
  height: 100%;
`;

const MonstieList = styled.ul`
  // border: 2px dashed salmon;
  width: 100%;
  padding: 0.5rem;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 15px;
`;

// clean up / style
// input for region filter
// show egg mode only
// clean up spacing
// do logic

type TemplateProps = { className?: string };

const example = [
  {
    name: "Crimson Qurupeco",
    egg: CrimsonQurupecoEgg,
    icon: CrimsonQurupecoIcon,
    color: "#FB494A",
    location: "Alcala",
    den: "rare",
  },
  {
    name: "Barioth",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/0/0c/MHST2-Barioth_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/c/c5/MHST2-Barioth_Icon.png",
    color: "#7edeff",
    location: "Loloska",
    den: "monster",
  },
  {
    name: "Anjanath",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/d/d2/MHST2-Anjanath_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/4/4b/MHST2-Anjanath_Icon.png",
    color: "#FB494A",
    location: "Loloska",
    den: "highRank",
  },
  {
    name: "Astalos",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/5/5d/MHST2-Astalos_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/c/cf/MHST2-Astalos_Icon.png",
    color: "#ffcd4a",
    location: "Terga",
    den: "rare-highRank",
  },
  {
    name: "Black Diablos",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/8/80/MHST2-Black_Diablos_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/0/06/MHST2-Black_Diablos_Icon.png",
    color: "#858585",
    location: "Lamure Tower",
    den: "superRare-highRank",
  },
  {
    name: "Crimson Qurupeco",
    egg: CrimsonQurupecoEgg,
    icon: CrimsonQurupecoIcon,
    color: "#FB494A",
    location: "Alcala",
    den: "rare",
  },
  {
    name: "Barioth",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/0/0c/MHST2-Barioth_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/c/c5/MHST2-Barioth_Icon.png",
    color: "#7edeff",
    location: "Loloska",
    den: "monster",
  },
  {
    name: "Anjanath",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/d/d2/MHST2-Anjanath_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/4/4b/MHST2-Anjanath_Icon.png",
    color: "#FB494A",
    location: "Loloska",
    den: "highRank",
  },
  {
    name: "Astalos",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/5/5d/MHST2-Astalos_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/c/cf/MHST2-Astalos_Icon.png",
    color: "#ffcd4a",
    location: "Terga",
    den: "rare-highRank",
  },
  {
    name: "Black Diablos",
    egg: "https://static.wikia.nocookie.net/monsterhunter/images/8/80/MHST2-Black_Diablos_Egg.svg",
    icon: "https://static.wikia.nocookie.net/monsterhunter/images/0/06/MHST2-Black_Diablos_Icon.png",
    color: "#858585",
    location: "Lamure Tower",
    den: "superRare-highRank",
  },
];

const Template = ({ className }: TemplateProps) => {
  return (
    <Container className={className}>
      {/* Obtainable Genes */}
      <MonstieList>
        {example.map((monstie: any) => (
          <li>
            <MonstieToken monstie={monstie}></MonstieToken>
          </li>
        ))}
        {/* <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken>
        <MonstieToken monstie={monstieEx1}></MonstieToken> */}
      </MonstieList>
    </Container>
  );
};

export default Template;
