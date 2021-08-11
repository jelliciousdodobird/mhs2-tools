// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Gutter from "./Gutter";

const Container = styled.footer`
  /* border: 2px dashed red; */

  padding: 2rem 0;

  background-color: ${({ theme }) => theme.colors.surface.main};
  height: 30rem;
`;

type TemplateProps = {};

const Footer = ({}: TemplateProps) => {
  return (
    <Container>
      <Gutter>
        <div>Footer</div>
      </Gutter>
    </Container>
  );
};

export default Footer;
