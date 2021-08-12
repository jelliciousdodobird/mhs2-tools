// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

import { ReactComponent as CircleSvg } from "../assets/egg-patterns/circle.svg";
import { ReactComponent as FlatSpotSvg } from "../assets/egg-patterns/flat-spot.svg";
import { ReactComponent as JaggedStripeSvg } from "../assets/egg-patterns/jagged-stripe.svg";
import { ReactComponent as LightningSvg } from "../assets/egg-patterns/lightning.svg";
import { ReactComponent as NuggetSvg } from "../assets/egg-patterns/nugget.svg";
import { ReactComponent as ShurikenSvg } from "../assets/egg-patterns/shuriken.svg";
import { ReactComponent as SparkleSvg } from "../assets/egg-patterns/sparkle.svg";
import { ReactComponent as StarSvg } from "../assets/egg-patterns/star.svg";
import { ReactComponent as VerticalSpotSvg } from "../assets/egg-patterns/vertical-spot.svg";
import { ReactComponent as VerticalStripeSvg } from "../assets/egg-patterns/vertical-stripe.svg";
import { ReactComponent as WavyStripe } from "../assets/egg-patterns/wavy-stripe.svg";
import { ReactComponent as ZebraSvg } from "../assets/egg-patterns/zebra.svg";
import color from "color";

const SVG_PATTERN = {
  circle: CircleSvg,
  "flat-spot": FlatSpotSvg,
  "jagged-stripe": JaggedStripeSvg,
  lightning: LightningSvg,
  nugget: NuggetSvg,
  shuriken: ShurikenSvg,
  sparkle: SparkleSvg,
  star: StarSvg,
  "vertical-spot": VerticalSpotSvg,
  "vertical-stripe": VerticalStripeSvg,
  "wavy-stripe": WavyStripe,
  zebra: ZebraSvg,
};

export type PatternType = keyof typeof SVG_PATTERN;

const getSvgElement = (svg = ZebraSvg) => styled(svg)<{
  bgcolor: string;
  patterncolor: string;
}>`
  width: 100%;
  height: 100%;

  #bg {
    fill: ${({ bgcolor }) => bgcolor};
    stroke: ${({ bgcolor }) => color(bgcolor).darken(0.15).hex()};
    stroke-width: 5px;
    paint-order: stroke;
  }

  #pattern {
    path {
      fill: ${({ patterncolor }) => patterncolor};
    }
  }
`;

type Props = {
  className?: string | undefined;
  patternType: PatternType;
  bgColor: string;
  patternColor: string;
};

const Egg = ({ className, patternType, bgColor, patternColor }: Props) => {
  const Svg = getSvgElement(SVG_PATTERN[patternType]);

  const bgcolor = bgColor;
  const patterncolor = patternColor;

  return (
    <Svg
      title={patternType}
      bgcolor={bgcolor}
      patterncolor={patterncolor}
      className={className}
    />
  );
};

export default Egg;
