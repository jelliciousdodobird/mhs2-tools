import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import { createPortal } from "react-dom";
import {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Debug from "./Debug";

type ContainerProps = {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  position: { x: number; y: number };
};

// const SortIndicator = styled(motion.span)<SortIndicatorProps>

const Container = styled(motion.div)<ContainerProps>`
  /* border: 1px solid red; */
  /* overflow: hidden; */
  position: fixed;
  z-index: 1000;

  top: ${({ position }) => position.y}px;
  left: ${({ position }) => position.x}px;

  margin-top: ${({ marginTop }) => marginTop}px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
  margin-left: ${({ marginLeft }) => marginLeft}px;
  margin-right: ${({ marginRight }) => marginRight}px;
`;

const TooltipContent = styled.div`
  position: relative;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.onPrimary.main};

  font-weight: 600;

  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);
`;

export type Pinner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface TooltipProps {
  text?: string;
  children?: ReactElement;

  stickToRef: any;
  tooltipPin?: Pinner;
  stickToPin?: Pinner;

  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  close?: () => void;
}

// export interface CustomTooltip extends BaseTooltipProps {
//   text: never;
//   children: ReactElement;
// }

// export interface TextTooltip extends BaseTooltipProps {
//   text: string;
//   children: never;
// }

// export type TooltipProps = TextTooltip | CustomTooltip;

const resolvePins = (
  parentRect: { x: number; y: number; width: number; height: 0 },
  childDimensions: { width: number; height: number },
  parentPin: Pinner,
  childPin: Pinner
): { x: number; y: number } => {
  const p = parentRect;
  const c = childDimensions;
  let position = { x: 0, y: 0 };

  if (parentPin === "top-left" && childPin === "top-left")
    position = { x: p.x, y: p.y };
  else if (parentPin === "top-left" && childPin === "top-right")
    position = { x: p.x - c.width, y: p.y };
  else if (parentPin === "top-left" && childPin === "bottom-left")
    position = { x: p.x, y: p.y - c.height };
  else if (parentPin === "top-left" && childPin === "bottom-right")
    position = { x: p.x - c.width, y: p.y - c.height };
  ////////////////////////////////////////////////////////////////////
  else if (parentPin === "top-right" && childPin === "top-left")
    position = { x: p.x + p.width, y: p.y };
  else if (parentPin === "top-right" && childPin === "top-right")
    position = { x: p.x, y: p.y };
  else if (parentPin === "top-right" && childPin === "bottom-left")
    position = { x: p.x + p.width, y: p.y - c.height };
  else if (parentPin === "top-right" && childPin === "bottom-right")
    position = { x: p.x - (c.width - p.width), y: p.y - c.height };
  ////////////////////////////////////////////////////////////////////
  else if (parentPin === "bottom-left" && childPin === "top-left")
    position = { x: p.x, y: p.y + p.height };
  else if (parentPin === "bottom-left" && childPin === "top-right")
    position = { x: p.x - c.width, y: p.y + p.height };
  else if (parentPin === "bottom-left" && childPin === "bottom-left")
    position = { x: p.x, y: p.y };
  else if (parentPin === "bottom-left" && childPin === "bottom-right")
    position = { x: p.x - c.width, y: p.y - (c.height - p.height) };
  ////////////////////////////////////////////////////////////////////
  else if (parentPin === "bottom-right" && childPin === "top-left")
    position = { x: p.x + p.width, y: p.y + p.height };
  else if (parentPin === "bottom-right" && childPin === "top-right")
    position = { x: p.x - (c.width - p.width), y: p.y + p.height };
  else if (parentPin === "bottom-right" && childPin === "bottom-left")
    position = { x: p.x + p.width, y: p.y - (c.height - p.height) };
  else if (parentPin === "bottom-right" && childPin === "bottom-right")
    position = { x: p.x, y: p.y };

  // console.log("pos", position);
  // console.log("p", p, "c", c);

  return position;
};

// for testing these two props:
// stickToPin="top-left" tooltipPin="top-left"
// stickToPin="top-left" tooltipPin="top-right"
// stickToPin="top-left" tooltipPin="bottom-left"
// stickToPin="top-left" tooltipPin="bottom-right"

// stickToPin="top-right" tooltipPin="top-left""
// stickToPin="top-right" tooltipPin="top-right"
// stickToPin="top-right" tooltipPin="bottom-left"
// stickToPin="top-right" tooltipPin="bottom-right"

// stickToPin="bottom-left" tooltipPin="top-left"
// stickToPin="bottom-left" tooltipPin="top-right"
// stickToPin="bottom-left" tooltipPin="bottom-left"
// stickToPin="bottom-left" tooltipPin="bottom-right"

// stickToPin="bottom-right" tooltipPin="top-left"
// stickToPin="bottom-right" tooltipPin="top-right"
// stickToPin="bottom-right" tooltipPin="bottom-left"
// stickToPin="bottom-right" tooltipPin="bottom-right"

const RefModal = ({
  text,
  children,
  stickToRef,
  tooltipPin = "top-left",
  stickToPin = "bottom-left",
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipDimensions, setTooltipDimensions] = useState({
    width: 0,
    height: 0,
  });

  // const tooltipRect = tooltipRef.current?.getBoundingClientRect();
  // const tooltipDimensions = {
  //   width: tooltipRect ? tooltipRect.width : 0,
  //   height: tooltipRect ? tooltipRect.height : 0,
  // };
  const stickyToRefRect = stickToRef.current.getBoundingClientRect();

  const parentRect = {
    x: stickyToRefRect.x,
    y: stickyToRefRect.y,
    width: stickyToRefRect.width,
    height: stickyToRefRect.height,
  };

  // const position = useMemo(
  //   () =>
  //     resolvePins(
  //       parentRect,
  //       tooltipDimensions as { width: number; height: number },
  //       stickToPin,
  //       tooltipPin
  //     ),
  //   [parentRect, stickToPin, tooltipPin, tooltipDimensions]
  // );
  const position = resolvePins(
    parentRect,
    tooltipDimensions as { width: number; height: number },
    stickToPin,
    tooltipPin
  );

  console.log("outside", position);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();

      setTooltipDimensions({ width, height });
      console.log("longhint");
    }
  }, [tooltipRef.current]);

  // useEffect(() => {
  //   console.log("lsjdflkjsdkf");
  // }, [stickyToRefRect]);

  const element = (
    <Container
      ref={tooltipRef}
      position={position}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginRight={marginRight}
      marginLeft={marginLeft}
    >
      {text && !children && <TooltipContent>{text}</TooltipContent>}
      {children}
    </Container>
  );

  return createPortal(element, document.getElementById("root") as Element);
};

export default RefModal;
