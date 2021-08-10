// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Asset from "./AssetComponents";

import { ReactComponent as LogoClipSvg } from "../assets/logo-clip.svg";

import { rainbowGradient } from "./GeneSlot";
import { rainbowTextGradient } from "../pages/BuildPage";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useEffect } from "react";

const Container = styled(motion.div)`
  position: relative;
  /* border: 1px dashed red; */
  background-image: ${rainbowTextGradient()};
  background-size: 1500%;
  /* background-position: 3%; */

  /* background-attachment: local; */
  /* background-color: white; */
  /* clip-path: circle(20% at 5% 5%) circle(20% at 5% 5%); */

  clip-path: url(#logo-clip);

  height: 100%;
  width: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;

  height: 3rem;
  width: 3rem;

  /* height: 90%; */
  /* width: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px; */

  /* transform: scale(0.6); */

  display: flex;
`;

type LogoProps = {};

const Logo = ({}: LogoProps) => {
  const { scrollYProgress } = useViewportScroll();
  const percentString = useTransform(
    scrollYProgress,
    (latest) => `${Math.floor(latest * 100)}%`
  );

  const percent = useTransform(scrollYProgress, (latest) =>
    Math.floor(latest * 100)
  );

  const rotation = useTransform(percent, [0, 100], [0, 360]);

  useEffect(() => {
    // scrollYProgress.onChange((latest) => {
    //   console.log(latest);
    // });
  }, []);

  return (
    <Container style={{ backgroundPosition: percentString }}>
      {/* <LogoSvg2 /> */}
      <LogoClipSvg />
    </Container>
  );
};

export default Logo;
