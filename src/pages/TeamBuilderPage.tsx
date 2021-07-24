// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";

// data:
import DATA from "../utils/output.json";

// custom component:
import BingoBoard from "../components/BingoBoard";
import DraggableGene from "../components/DraggableGene";
import CustomDragLayer from "../components/CustomDragLayer";
import Gene, {
  MonstieGene,
  SkillType,
  AttackType,
  ElementType,
  Skill,
} from "../components/Gene";

const TESTGENE = {
  geneName: "Water Breath Gene (M)",
  geneNumber: 70,
  attackType: "speed" as AttackType,
  elementType: "water" as ElementType,
  requiredLvl: 10,
  geneSize: 2,
  skill: {
    skillName: "Bewitching Bubbles",
    skillType: "active" as SkillType,
    desc: "Deals medium water damage to all enemies. Low chance to lower Speed and Accuracy for 3 turns.",
  } as Skill,
  possessedBy: { native: ["Mizutsune"], random: [] },
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const SearchBoxGene = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TeamBuilderPage = () => {
  const [genes, setGenes] = useState<MonstieGene[]>([]);

  useEffect(() => {
    const genes = DATA.genes;

    const sanitizedGenes: MonstieGene[] = [];

    genes.forEach((gene) => {
      const cleanedGene: MonstieGene = {
        geneName: gene.gene_name,
        geneNumber: gene.gene_number,
        attackType: gene.attack_type as AttackType,
        elementType: gene.element_type as ElementType,
        requiredLvl: gene.required_lvl,
        geneSize: gene.gene_size,
        skill: {
          skillName: gene.skill.name,
          skillType: gene.skill.type as SkillType,
          desc: gene.skill.desc,
        } as Skill,
        possessedBy: {
          native: gene.possessed_by.native,
          random: gene.possessed_by.random,
        },
      };

      sanitizedGenes.push(cleanedGene);
    });

    setGenes(sanitizedGenes);
  }, []);

  return (
    <>
      <DndProvider options={HTML5toTouch}>
        <Container>
          <BingoBoard />
          <SearchBoxGene>
            {genes.slice(0, 100).map((gene) => (
              <DraggableGene
                key={gene.geneName}
                gene={gene}
                draggableType="gene"
              />
            ))}
          </SearchBoxGene>

          <CustomDragLayer />
        </Container>
      </DndProvider>
    </>
  );
};

export default TeamBuilderPage;
