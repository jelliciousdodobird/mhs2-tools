// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";

export const GUTTER = (props: any) => css`
  @media (max-width: ${props.theme.breakpoints.xxl}px) {
    padding: 0 25%;

    /* padding: 0 30%; */
    /* background-color: red; */
  }

  @media (max-width: ${props.theme.breakpoints.xl}px) {
    padding: 0 15%;

    /* padding: 0 20%; */
    /* background-color: orange; */
  }

  @media (max-width: ${props.theme.breakpoints.l}px) {
    padding: 0 15%;
    /* background-color: yellow; */
  }

  @media (max-width: ${props.theme.breakpoints.m}px) {
    padding: 0 2rem;
    /* background-color: green; */
  }

  @media (max-width: ${props.theme.breakpoints.s}px) {
    padding: 0 0.75rem;
    /* background-color: blue; */
  }

  @media (max-width: ${props.theme.breakpoints.xs}px) {
    padding: 0 0.75rem;
    /* background-color: purple; */
  }
`;

const Container = styled.div`
  ${GUTTER}
`;

type Props = {
  children: ReactElement | ReactElement[];
  className?: string;
};

const Gutter = ({ children, className }: Props) => {
  return <Container className={className}>{children}</Container>;
};

export default Gutter;
