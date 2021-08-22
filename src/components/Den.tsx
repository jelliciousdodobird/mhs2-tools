// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { BiGitCompare } from "react-icons/bi";
import { FaRegCalendarPlus } from "react-icons/fa";
import { GiStrongMan } from "react-icons/gi";

const DEN_TYPE = {
  everden: { name: "E", color: "#929292" },
  subquest: { name: "Sb", color: "#929292" },
  "highRank-subquest": { name: "HSb", color: "#929292" },
  monster: { name: "M", color: "#d7d7d7" },
  rare: { name: "R", color: "#d2ba1d" },
  highRank: { name: "H", color: "#dc644e" },
  "rare-highRank": { name: "RH", color: "#f7e467" },
  "superRare-highRank": { name: "SR", color: "#93f6ed" },
};

export type DenType = keyof typeof DEN_TYPE;

type Props = {
  className?: string;
  denType: DenType;
};

const DenContainer = styled.h4<{ bg: string }>`
  background-color: ${({ bg }) => `${bg}`};
  border-radius: 100%;

  height: 1.5rem;
  width: 1.5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 600;
  font-size: 80%;

  color: ${({ theme }) => theme.colors.onPrimary.main};
`;

const Den = ({ className, denType }: Props) => {
  return (
    <DenContainer bg={DEN_TYPE[denType].color}>
      {DEN_TYPE[denType].name}
    </DenContainer>
  );
};

export default Den;
