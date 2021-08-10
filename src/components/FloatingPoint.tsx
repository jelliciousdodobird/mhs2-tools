// styling:
import { css, jsx, ThemeContext, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

type ContainerProps = {
  w: number;
  offset: { x: number; y: number };

  top?: number | null;
  left?: number | null;
  right?: number | null;
  bottom?: number | null;

  // top?: boolean;
  // left?: boolean;
  // right?: boolean;
  // bottom?: boolean;

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
  children?: ReactElement | ReactElement[];
  portalId?: string;

  // top?: boolean;
  // left?: boolean;
  // right?: boolean;
  // bottom?: boolean;
  top?: number;

  bottom?: number;

  zIndex?: number;
};

const FloatingPoint = ({
  parentContainerRef,
  children,
  portalId,
  top,

  bottom,

  zIndex,
}: FloatingPointProps) => {
  const { width = 0 } = useResizeObserver({ ref: parentContainerRef });
  const theme = useTheme();

  const offset = parentContainerRef.current?.getBoundingClientRect();
  const scroll = parentContainerRef.current?.scrollTop;

  const actualWidth = offset?.width || 0;
  const y = offset?.height || 0;

  const topAdjusted =
    top !== undefined ? top + theme.dimensions.mainNav.maxHeight : undefined;
  const bottomAdjusted = bottom; // bottom does not need any adjustments

  const leftAdjusted = offset?.left || 0;

  return (
    <Container
      w={actualWidth}
      offset={{ x: 0, y }}
      id={portalId}
      top={topAdjusted}
      bottom={bottomAdjusted}
      // right={rightAdjusted}
      left={leftAdjusted}
      zIndex={zIndex}
    >
      {children}
    </Container>
  );
};

export default FloatingPoint;
