// styling:
import { css, jsx, ThemeContext } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

type ContainerProps = {
  w: number;
  offset: { x: number; y: number };

  top?: number;
  left?: number;
  right?: number;
  bottom?: number;

  zIndex?: number;
};

const Container = styled.div<ContainerProps>`
  /* border: 1px dashed red; */

  position: fixed;

  ${({ top, bottom, left, right, zIndex = 999 }) => css`
    z-index: ${zIndex};

    top: ${top}px;
    bottom: ${bottom}px;
    right: ${right}px;
    left: ${left}px;
  `}

  /* margin-left: ${({ offset }) => offset.x}px; */

  width: ${({ w }) => w}px;
  min-width: ${({ w }) => w}px;
  max-width: ${({ w }) => w}px;

  /* background-color: red; */
`;

type FloatingPointProps = {
  parentContainerRef: React.RefObject<HTMLElement>;
  children?: ReactElement;
  portalId?: string;

  top?: number;
  left?: number;
  right?: number;
  bottom?: number;

  zIndex?: number;
};

const FloatingPoint = ({
  parentContainerRef,
  children,
  portalId,
  top,
  left,
  right,
  bottom,
  zIndex,
}: FloatingPointProps) => {
  const { width = 0 } = useResizeObserver({ ref: parentContainerRef });

  const offset = parentContainerRef.current?.getBoundingClientRect();
  const scroll = parentContainerRef.current?.scrollTop;

  const actualWidth = offset?.width || 0;
  const y = offset?.height || 0;

  // console.log("------");
  // console.log(offset, scroll);
  // console.log(y, scroll);
  // console.log(width);
  return (
    <Container
      w={actualWidth}
      offset={{ x: 0, y }}
      id={portalId}
      top={top}
      bottom={bottom}
      right={right}
      left={left}
      zIndex={zIndex}
    >
      {children}
    </Container>
  );
};

export default FloatingPoint;
