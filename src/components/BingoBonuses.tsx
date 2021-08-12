// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import {
  AttackType,
  ElementType,
  MonstieGene,
  StrictAttack,
  StrictElement,
} from "../utils/ProjectTypes";
import { findBingosInFlatArray, getBingoCountAndBonus } from "../utils/utils";

import Asset from "./AssetComponents";

const Container = styled.table`
  width: 100%;
  /* height: 100%; */

  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.7rem;

  thead,
  tbody {
    gap: 0.5rem;

    tr {
      /* background-color: ${({ theme }) => theme.colors.surface.main}; */
      /* margin-bottom: 0.5rem; */

      /* padding: 0.5rem 1rem; */
      /* border-radius: 5rem; */
      padding: 0 0.5rem;

      td {
        /* border: 1px solid green; */
        /* min-height: 2rem; */
      }
    }
  }
`;

const gridStyles = () => css`
  display: grid;

  grid-template-columns: minmax(0, 0.5fr) minmax(0, 2fr) minmax(0, 1fr) minmax(
      0,
      1.5fr
    );

  grid-template-rows: minmax(1fr, 1fr);
`;

const Thead = styled.thead`
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background.main};

  border-radius: 1rem;
  padding: 0.5rem 0;
  /* margin-bottom: 0.5rem; */
  tr {
    ${gridStyles}

    td {
      display: flex;
      align-items: center;

      color: ${({ theme }) => theme.colors.onSurface.main};
      font-size: 0.9rem;
      font-weight: 600;
      /* padding: 0.2rem 1rem;
      padding-left: 0; */
    }
    td:nth-of-type(1) {
    }
    td:nth-of-type(2) {
    }
    td:nth-of-type(3) {
    }
  }
`;

const Tbody = styled.tbody`
  display: flex;
  flex-direction: column;

  tr {
    ${gridStyles}

    td {
      color: ${({ theme }) => theme.colors.onSurface.main};
      font-size: 0.8rem;
      text-transform: capitalize;

      display: flex;
      align-items: center;
    }
    td:nth-of-type(1) {
    }
    td:nth-of-type(2) {
    }
    td:nth-of-type(3) {
    }
  }
`;

const TR = styled.tr<{ highlight: boolean }>`
  ${({ highlight, theme }) =>
    highlight
      ? css`
          td:nth-of-type(3),
          td:nth-of-type(4) {
            color: ${theme.colors.correct.main};
            font-weight: 700;
          }
        `
      : null}
`;

const TD = styled.td`
  /* border: 1px dashed red; */
  display: flex;
`;

type BingoBonusesProps = {
  geneBuild: MonstieGene[];
  className?: string;
  showBingosOnly?: boolean;
};

type CountBonus = {
  type: string;
  count: number;
  bonus: number;
};

const BingoBonuses = ({
  geneBuild,
  className,
  showBingosOnly = false,
}: BingoBonusesProps) => {
  const [bonuses, setBonuses] = useState<CountBonus[]>([]);

  useEffect(() => {
    const freqs = getBingoCountAndBonus(geneBuild);

    if (showBingosOnly) setBonuses(freqs.filter(({ count }) => count > 0));
    else setBonuses(freqs);
  }, [geneBuild, showBingosOnly]);

  return (
    <Container
      className={className}
      style={bonuses.length === 0 ? { gap: 0 } : {}}
    >
      <Thead>
        <tr>
          <TD></TD>
          <TD>Type</TD>
          <TD>#</TD>
          <TD>Damage</TD>
        </tr>
      </Thead>
      <Tbody>
        {bonuses.map(({ type, count, bonus }) => (
          <TR key={type} highlight={count > 0}>
            <TD>
              <Asset asset={type} size={20} />
            </TD>
            <TD>{type.replace("-", " ")}</TD>
            <TD>{count}</TD>
            <TD>{(bonus * 100).toFixed(0)}%</TD>
          </TR>
        ))}
      </Tbody>
    </Container>
  );
};

export default BingoBonuses;
