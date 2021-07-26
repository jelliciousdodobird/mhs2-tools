import {
  AttackType,
  ElementType,
  MonstieGene,
  Skill,
  SkillType,
} from "../components/Gene";

export const EMPTY_GENE: MonstieGene = {
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

export const EMPTY_BOARD = [...Array(9).keys()].map(() => EMPTY_GENE);

export const isEmptyGene = (gene: MonstieGene) =>
  gene.geneName === "" || gene.geneName.includes("empty_");

export const addEmptyGeneInfo = (list: MonstieGene[]) =>
  list.map((gene, i) => {
    if (isEmptyGene(gene)) {
      return { ...gene, geneName: `empty_${i}` };
    } else return gene;
  });

export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

export const swap = (i: number, j: number, list: MonstieGene[]) => {
  const temp = list[i];
  list[i] = list[j];
  list[j] = temp;
};

export const place = (
  targetIndex: number,
  gene: MonstieGene,
  list: MonstieGene[]
) => {
  list[targetIndex] = gene;
};

export const shuffleArray = (arr: any[]) => {
  arr = [...arr];

  for (let i = 0; i < 50; i++) {
    const a = randomNumber(0, arr.length);
    const b = randomNumber(0, arr.length);
    swap(a, b, arr);
  }

  return arr;
};

export const clamp = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(number, max));
