// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { createElement } from "react";

const SvgWrapperContainer = styled.span<{ size: number }>`
  svg {
    ${({ size }) =>
      size !== -1 &&
      css`
        width: ${size}px;
        height: ${size}px;
      `};
  }
`;

type SvgWrapperProps = {
  svgComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  size?: number;
  title?: string;
};

const SvgWrapper = ({ svgComponent, size = -1, title }: SvgWrapperProps) => {
  return (
    <SvgWrapperContainer size={size} title={title}>
      {createElement(svgComponent)}
    </SvgWrapperContainer>
  );
};

export default SvgWrapper;
