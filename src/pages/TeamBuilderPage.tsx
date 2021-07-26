// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useState } from "react";

//hooks:
import useDrop from "../hooks/useDrop";

// custom component:
import BingoBoard from "../components/BingoBoard";

import GeneSearch from "../components/GeneSearch";

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  overflow: auto;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background.main};
`;

const TeamBuilderPage = () => {
  const { drop, setDrop } = useDrop();
  const [dropSuccess, setDropSuccess] = useState(false);

  return (
    <>
      <Container>
        <BingoBoard
          drop={drop}
          setDrop={setDrop}
          setDropSuccess={setDropSuccess}
        />

        <GeneSearch
          // genes={genes}
          setDrop={setDrop}
          setDropSuccess={setDropSuccess}
          dropSuccess={dropSuccess}
        />
      </Container>
    </>
  );
};

export default TeamBuilderPage;
