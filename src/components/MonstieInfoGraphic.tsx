// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import DATA from "../utils/output.json";

import HexagonStats from "./HexagonStats";

// custom components:
import SvgWrapper from "./SvgWrapper";

// assets:
import { ReactComponent as DragonSvg } from "../assets/dragon.svg";
import { ReactComponent as FireSvg } from "../assets/fire.svg";
import { ReactComponent as IceSvg } from "../assets/ice.svg";
import { ReactComponent as NonElementSvg } from "../assets/non_elemental.svg";
import { ReactComponent as ThunderSvg } from "../assets/thunder.svg";
import { ReactComponent as WaterSvg } from "../assets/water.svg";
const elementSize = 20;
const NonElemental = (
  <SvgWrapper svgComponent={NonElementSvg} size={elementSize} />
);
const Fire = <SvgWrapper svgComponent={FireSvg} size={elementSize} />;
const Water = <SvgWrapper svgComponent={WaterSvg} size={elementSize} />;
const Thunder = <SvgWrapper svgComponent={ThunderSvg} size={elementSize} />;
const Ice = <SvgWrapper svgComponent={IceSvg} size={elementSize} />;
const Dragon = <SvgWrapper svgComponent={DragonSvg} size={elementSize} />;

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  /* background-color: green; */

  /* overflow: auto; */
`;

export type MonstieProps = {
  data: any;
};

const ATTACK_EXTREMAS = DATA.metaStats.extrema_stats.attack;
const DEFENSE_EXTREMAS = DATA.metaStats.extrema_stats.defense;

const monstieStatToHexStats = (monstieStats: any) => {
  const hexStats = [];

  for (const key in monstieStats) {
    let componentLabel;

    switch (key) {
      case "non_elemental":
        componentLabel = NonElemental;
        break;
      case "fire":
        componentLabel = Fire;

        break;
      case "water":
        componentLabel = Water;

        break;
      case "thunder":
        componentLabel = Thunder;

        break;
      case "ice":
        componentLabel = Ice;

        break;
      case "dragon":
        componentLabel = Dragon;
        break;
    }

    hexStats.push({
      label: key,
      componentLabel,
      value: monstieStats[key],
    });
  }

  return hexStats;
};

const MonstieInfoGraphic = ({ data }: MonstieProps) => {
  const [lvl, setLvl] = useState(99);

  const atkMax = ATTACK_EXTREMAS.find(
    (lvlStat) => lvlStat.lvl === lvl
  )?.highest;

  const defMax = DEFENSE_EXTREMAS.find(
    (lvlStat) => lvlStat.lvl === lvl
  )?.highest;

  const monstieStats = data.stats.find((statline: any) => statline.lvl === lvl);

  const atkStats = monstieStatToHexStats(monstieStats.attack);
  const defStats = monstieStatToHexStats(monstieStats.defense);

  const test = [
    { label: "non elemental", value: 9 },
    { label: "fire", value: 9 },
    { label: "water", value: 0 },
    { label: "thunder", value: 9 },
    { label: "ice", value: 9 },
    { label: "dragon", value: 9 },
  ];

  useEffect(() => {}, []);

  return (
    <Container>
      <HexagonStats hexStats={atkStats} title="atk" max={atkMax} />
      <HexagonStats hexStats={defStats} title="def" max={defMax} />
    </Container>
  );
};

export default MonstieInfoGraphic;
