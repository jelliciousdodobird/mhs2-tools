// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useDrop } from "react-dnd";

import { useEffect, useState } from "react";
import Gene, {
  AttackType,
  ElementType,
  SkillType,
  Skill,
  MonstieGene,
} from "./Gene";
import GeneSlot from "./GeneSlot";
import DraggableGene from "./DraggableGene";

const slotSize = 110;

const Board = styled.div`
  position: relative;
  width: ${slotSize * 3}px;
  height: ${slotSize * 3}px;

  background-color: ${({ theme }) => theme.colors.surface.main};
  gap: 0.5rem;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
`;

const EmptySlot = styled.div``;

const TEST_DATA: MonstieGene[] = [
  {
    geneName: "Whip Gene (S)",
    geneNumber: 1,
    attackType: "technical",
    elementType: "non-elemental",
    requiredLvl: 4,
    geneSize: 1,
    skill: {
      skillName: "Tail Spin",
      skillType: "active",
      desc: "Deals light non-elemental damage to all enemies.",
    },
    possessedBy: { native: ["Pukei-Pukei"], random: [] },
  },
  {
    geneName: "Whip Gene (L)",
    geneNumber: 3,
    attackType: "power",
    elementType: "fire",
    requiredLvl: 15,
    geneSize: 3,
    skill: {
      skillName: "Tail Spin Bomb",
      skillType: "active",
      desc: "Deals medium fire damage to all enemies. High chance to inflict Blastblight.",
    },
    possessedBy: { native: ["Uragaan"], random: [] },
  },
  {
    geneName: "Full Swing Gene (M)",
    geneNumber: 6,
    attackType: "power",
    elementType: "fire",
    requiredLvl: 1,
    geneSize: 2,
    skill: {
      skillName: "Scorching Blade",
      skillType: "active",
      desc: "Deals medium fire damage to all enemies. Low chance to inflict Burn for 3 turns.",
    },
    possessedBy: { native: ["Glavenus"], random: [] },
  },
  {
    geneName: "Full Swing Gene (L)",
    geneNumber: 7,
    attackType: "power",
    elementType: "non-elemental",
    requiredLvl: 10,
    geneSize: 3,
    skill: {
      skillName: "Ruinous Tackle",
      skillType: "active",
      desc: "Deals heavy non-elemental damage to one enemy.",
    },
    possessedBy: { native: ["Nergigante"], random: [] },
  },
  {
    geneName: "Full Swing Gene (XL)",
    geneNumber: 8,
    attackType: "speed",
    elementType: "non-elemental",
    requiredLvl: 40,
    geneSize: 4,
    skill: {
      skillName: "Hellish Heavyweight",
      skillType: "active",
      desc: "Deals heavy non-elemental damage to all enemies.",
    },
    possessedBy: { native: ["Bloodbath Diablos"], random: [] },
  },
  {
    geneName: "Piercing Claws Gene (S)",
    geneNumber: 9,
    attackType: "technical",
    elementType: "non-elemental",
    requiredLvl: 1,
    geneSize: 1,
    skill: {
      skillName: "Beak Drill",
      skillType: "active",
      desc: "Deals light non-elemental damage to one enemy.",
    },
    possessedBy: { native: ["Yian Kut-Ku", "Blue Yian Kut-Ku"], random: [] },
  },
  {
    geneName: "Piercing Claws Gene (XL)",
    geneNumber: 12,
    attackType: "speed",
    elementType: "non-elemental",
    requiredLvl: 1,
    geneSize: 4,
    skill: {
      skillName: "Venom Sweep",
      skillType: "active",
      desc: "Deals heavy non-elemental damage to all enemies. Medium chance to inflict Poison for 3 turns.",
    },
    possessedBy: { native: ["Pink Rathian"], random: [] },
  },
  {
    geneName: "Tackle Gene (S)",
    geneNumber: 13,
    attackType: "technical",
    elementType: "non-elemental",
    requiredLvl: 10,
    geneSize: 1,
    skill: {
      skillName: "Unstoppable",
      skillType: "active",
      desc: "Deals light non-elemental damage to all enemies.",
    },
    possessedBy: { native: ["Yian Kut-Ku"], random: [] },
  },
  {
    geneName: "Tackle Gene (M)",
    geneNumber: 14,
    attackType: "power",
    elementType: "ice",
    requiredLvl: 30,
    geneSize: 2,
    skill: {
      skillName: "Snowplow",
      skillType: "active",
      desc: "Deals medium ice damage to all enemies.",
    },
    possessedBy: { native: ["Gammoth"], random: [] },
  },
];

type BingoBoardProps = {};

const emptyGene: MonstieGene = {
  geneName: "",
  geneNumber: -1,
  attackType: "" as AttackType,
  elementType: "" as ElementType,
  requiredLvl: -1,
  geneSize: -1,
  skill: {
    skillName: "",
    skillType: "" as SkillType,
    desc: "",
  } as Skill,
  possessedBy: { native: [], random: [] },
};

const EMPTY_BOARD = [...Array(9).keys()].map(() => emptyGene);

const BingoBoard = ({}: BingoBoardProps) => {
  const [board, setBoard] = useState<MonstieGene[]>(EMPTY_BOARD);

  const placeGene = (i: number, gene: MonstieGene) =>
    setBoard((board) => {
      const index = board.findIndex(
        (boardGene) => boardGene.geneName === gene.geneName
      );
      if (index !== -1) {
        console.log("duplicate gene", gene.geneName, "found at index", index);
        return board;
      }

      const copy = [...board];

      copy[i] = gene;

      return copy;
    });

  const swapGenes = (initialIndex: number, targetGene: MonstieGene) => {
    // console.log("initial", initialIndex, "targetIndex", targetIndex);
    setBoard((board) => {
      const targetIndex = board.findIndex(
        (gene) => gene.geneName === targetGene.geneName
      );
      const copy = [...board];
      const initial = copy[initialIndex];
      const target = copy[targetIndex];

      copy[initialIndex] = target;
      copy[targetIndex] = initial;
      return copy;
    });
  };

  return (
    <Board onClick={() => console.log(board)}>
      <AnimateSharedLayout>
        {board.map((gene, i) => (
          <GeneSlot
            key={gene.geneName ? gene.geneName : i}
            index={i}
            updateBoard={placeGene}
            swapGenes={swapGenes}
          >
            {/* <SlotHole> */}
            {gene.geneName ? (
              <DraggableGene gene={gene} draggableType="gene-move" />
            ) : (
              <EmptySlot />
            )}
            {/* </SlotHole> */}
          </GeneSlot>
        ))}
      </AnimateSharedLayout>
    </Board>
  );
};
{
  /* {gene.geneName ? <Gene gene={gene} /> : <EmptySlot />} */
}
export default BingoBoard;
