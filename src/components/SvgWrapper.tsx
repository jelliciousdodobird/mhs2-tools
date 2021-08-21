// styling:
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { createElement } from "react";

const SvgWrapperContainer = styled.span<{ size?: number }>`
  svg {
    ${({ size }) =>
      size &&
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
  className?: string | undefined;
};

const SvgWrapper = ({
  svgComponent,
  size,
  title,
  className,
}: SvgWrapperProps) => {
  return (
    <SvgWrapperContainer size={size} title={title} className={className}>
      {createElement(svgComponent)}
    </SvgWrapperContainer>
  );
};

export default SvgWrapper;
