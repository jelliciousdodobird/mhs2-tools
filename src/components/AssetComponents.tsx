import SvgWrapper from "./SvgWrapper";
// assets:
import { ReactComponent as DragonSvg } from "../assets/dragon.svg";
import { ReactComponent as FireSvg } from "../assets/fire.svg";
import { ReactComponent as IceSvg } from "../assets/ice.svg";
import { ReactComponent as NonElementSvg } from "../assets/non_elemental.svg";
import { ReactComponent as ThunderSvg } from "../assets/thunder.svg";
import { ReactComponent as WaterSvg } from "../assets/water.svg";

import { ReactComponent as PowerSvg } from "../assets/power.svg";
import { ReactComponent as TechnicalSvg } from "../assets/technical.svg";
import { ReactComponent as SpeedSvg } from "../assets/speed.svg";
import { ReactComponent as RainbowSvg } from "../assets/rainbow.svg";

import { memo } from "react";

const ICONS = {
  "": null,

  // attack type icons:
  power: PowerSvg,
  technical: TechnicalSvg,
  speed: SpeedSvg,
  rainbow: RainbowSvg,

  // elemental icons:
  "non-elemental": NonElementSvg,
  fire: FireSvg,
  water: WaterSvg,
  thunder: ThunderSvg,
  ice: IceSvg,
  dragon: DragonSvg,
};

type AssetType = keyof typeof ICONS;

const iconKeys = [...Object.keys(ICONS)] as AssetType[];

// console.log(iconKeys);

export const coerceStringIntoAssetType = (str: string): AssetType => {
  str = str.toLowerCase().replaceAll("_", "-").replaceAll(" ", "-");

  let type: AssetType = "";
  iconKeys.forEach((key) => {
    if (str.includes(key)) type = key;
  });

  // // this is to better coerce the different possible forms of
  // // "non-elemental" like "non_elemental" or "non elemental
  // if (str.includes("non")) type = "non-elemental";

  return type;
};

type AssetProps = {
  asset: string;
  size?: number;
  title?: string;
};

const Asset = memo(({ asset, size, title }: AssetProps) => {
  const svg = ICONS[asset as AssetType]
    ? ICONS[asset as AssetType]
    : ICONS[coerceStringIntoAssetType(asset)];

  if (svg) return <SvgWrapper svgComponent={svg} size={size} title={title} />;
  else return <>{asset}</>;
});

export default Asset;
