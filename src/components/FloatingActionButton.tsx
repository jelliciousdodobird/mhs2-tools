// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { ReactElement } from "react";

export const Container = styled(motion.button)<{ size: number }>`
  z-index: 15;

  border-radius: 50%;

  ${({ size }) => css`
    width: ${size}rem;
    min-width: ${size}rem;
    max-width: ${size}rem;
    height: ${size}rem;
    min-height: ${size}rem;
    max-height: ${size}rem;
  `}

  background-color: ${({ theme }) => theme.colors.primary.main};

  /* box-shadow: 0px 0px 20px -10px ${({ theme }) =>
    theme.colors.primary.main}; */

  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: ${({ theme }) => theme.colors.onPrimary.main};
    }
  }
`;

const REM_SIZE = {
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
};

type FABSize = keyof typeof REM_SIZE;

type Props = {
  size?: FABSize;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children?: ReactElement | ReactElement[];
  // className?: string | undefined;
};

const FloatingActionButton = ({
  size = "l",
  type = "button",
  onClick,
  // className,
  children,
  ...props
}: Props) => {
  return (
    <Container
      size={REM_SIZE[size]}
      type={type}
      onClick={onClick}
      // className={className}
      {...props}
    >
      {children}
    </Container>
  );
};

export default FloatingActionButton;
