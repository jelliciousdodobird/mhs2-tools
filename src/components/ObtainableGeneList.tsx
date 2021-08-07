// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

const Container = styled.div`
  /* border: 2px dashed salmon; */

  background-color: ${({ theme }) => theme.colors.surface.main};
  padding: 1rem;
  border-radius: 1rem;

  width: 100%;
  height: 100%;
`;

type TemplateProps = { className?: string };

const Template = ({ className }: TemplateProps) => {
  return <Container className={className}>Obtainable Genes</Container>;
};

export default Template;
