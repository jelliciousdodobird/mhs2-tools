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

export const randomBoard = <T>(possibleGenes: T[]) => {
  const randomIndice = [...Array(9).keys()].map(() =>
    randomNumber(0, possibleGenes.length)
  );

  return randomIndice.map((randomIndex) => possibleGenes[randomIndex]);
};

export const clamp = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(number, max));

export const matrix = <T>(arr: T[], n = 3) => {
  return [...Array(n).keys()].map((_, i) => {
    return [...Array(n).keys()].map((_, j) => {
      return arr[j + i * n];
    });
  });
};

export const lineIndice: { [key: string]: number[] } = {
  row1: [0, 1, 2],
  row2: [3, 4, 5],
  row3: [6, 7, 8],
  column1: [0, 3, 6],
  column2: [1, 4, 7],
  column3: [2, 5, 8],
  diagnol1: [0, 4, 8],
  diagnol2: [2, 4, 6],
};

// export const isBingo = <T>(arr: T[], bingoIndices: number[]) => {
//   const line = bingoIndices
//     .map((index) => arr[index])
//     .filter((v) => (v as unknown) !== "rainbow");

//   return line.every((index) => index === line[0]);
// };

export const getLineInfo = <T>(arr: T[], lineIndice: number[]) => {
  const line = lineIndice
    .map((index) => arr[index])
    .filter((v) => (v as unknown) !== "rainbow");

  const isBingo = line.every((index) => index === line[0]);

  return { isBingo, type: isBingo ? line[0] : null };
};

export const findAllBingos = <T>(arr: T[]) => {
  const bingos = [];

  for (let lineKey in lineIndice) {
    const line = getLineInfo(arr, lineIndice[lineKey]);
    if (line.isBingo) {
      bingos.push({
        location: lineKey,
        type: line.type,
      });
    }
  }
  return bingos;
};
