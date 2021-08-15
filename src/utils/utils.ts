import base64url from "base64url";
import { create } from "domain";
import { nanoid } from "nanoid";
import { GeneBuild } from "../components/MonstieGeneBuild";

import {
  ElementType,
  AttackType,
  MonstieGene,
  Skill,
  SkillType,
  StrictAttack,
  StrictElement,
} from "../utils/ProjectTypes";

export const BLANK_GENE: MonstieGene = {
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

export const GENE_SIZE_LETTER: { [key: string]: string } = {
  1: "S",
  2: "M",
  3: "L",
  4: "XL",
  "": "",
};

export const EMPTY_BOARD = [...Array(9).keys()].map(() => BLANK_GENE);

export const isBlankGene = (gene: MonstieGene) =>
  gene.geneName === "" || gene.geneName.includes("blank_");

export const addEmptyGeneInfo = (list: MonstieGene[]) =>
  list.map((gene, i) => {
    if (isBlankGene(gene)) {
      return { ...gene, geneName: `blank_${i}` };
    } else return gene;
  });

export const cleanGeneBuild = (list: MonstieGene[]) => {
  // ensures that the gene build array has exactly 9 genes only, no more, no less
  // ensures that blank genes have a unique "blank_" geneName (which is used to uniquely identify genes)
  // there may be MULTIPLE blank genes and its important to distinguish between them
  // there does not exist empty SLOTS however (hence no less than 9 genes)
  // meaning if there are empty slots (where there is undefined gene data),
  // then we must fill in them in with blanks

  return [...Array(9).keys()].map((v) => {
    const gene = list[v];
    if (gene)
      return isBlankGene(gene) ? { ...gene, geneName: `blank_${v}` } : gene;
    else return { ...BLANK_GENE, geneName: `blank_${v}` };
  });
};

export const CLEAN_EMPTY_BOARD = cleanGeneBuild([]);

export const CORRUPTED_BUILD: GeneBuild = {
  buildId: "",
  buildName: "Corrupted",
  monstie: "",
  createdBy: "",
  geneBuild: CLEAN_EMPTY_BOARD,
};

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
    .filter((v) => (v as unknown) !== "all");

  const isBingo = line.every((index) => index === line[0]);

  return { isBingo, type: isBingo ? line[0] : null };
};

/**
 *
 * @param arr is an array of values (NOT OBJECTS) like [5, 6, 7, 8, ...] or ["fire", "water", "fire", "ice", ...]
 * @returns
 */
export const findBingosInFlatArray = <T>(arr: T[]) => {
  // const bingos: { location: string; type: T }[] = [];
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

type BingoInfo = {
  location: "string";
  type: StrictElement | StrictAttack;
};

export const getBingosFromGeneBuild = (geneBuild: MonstieGene[]) => {
  const elementTypes = geneBuild.map(({ elementType }) => elementType);
  const attackTypes = geneBuild.map(({ attackType }) => attackType);

  const elementTypeBingos = findBingosInFlatArray(elementTypes);
  const attackTypeBingos = findBingosInFlatArray(attackTypes);

  const combined = [...elementTypeBingos, ...attackTypeBingos].filter(
    ({ type }) => type !== null && type !== ""
  ) as BingoInfo[];

  return combined;

  // combined.forEach(({ type }) => {
  //   frequencies[type] = frequencies[type] + 1;
  // });
};

export const calcBonusMultiplier = (count: number) => {
  let total = 100;

  if (count <= 2) total = total + 10 * count;
  else if (count > 2) total = total + 20 + 5 * (count - 2);

  return total / 100;
};

export const getBingoCountAndBonus = (geneBuild: MonstieGene[]) => {
  const freqs = {
    "non-elemental": 0,
    fire: 0,
    water: 0,
    thunder: 0,
    ice: 0,
    dragon: 0,
    power: 0,
    speed: 0,
    technical: 0,
  };

  getBingosFromGeneBuild(geneBuild).forEach(({ type }) => {
    freqs[type] = freqs[type] + 1;
  });

  return Object.keys(freqs)
    .map((key) => ({
      type: key,
      count: freqs[key as StrictAttack | StrictElement],
      bonus: calcBonusMultiplier(freqs[key as StrictAttack | StrictElement]),
    }))
    .filter(({ type }) => type !== "none");
};

export const removeSizeFromName = (name: string) => name.split("(")[0];

export const removeGeneFromName = (name: string) =>
  name.replace("Gene", "").trim();

export const formatGeneName = (name: string) =>
  removeGeneFromName(removeSizeFromName(name));

export type ShortGeneBuild = {
  i: string;
  b: string;
  c: string;
  m: string;
  g: number[];
};

export const shrinkGeneBuild = (build: GeneBuild): ShortGeneBuild => {
  const { buildId, buildName, createdBy, monstie, geneBuild } = build;
  return {
    i: buildId,
    b: buildName,
    c: createdBy ? createdBy : "",
    m: monstie,
    g: geneBuild.map((gene) => gene.geneNumber),
  };
};

export const expandGeneBuild = (build: ShortGeneBuild): GeneBuild => {
  const { i, b, c, m, g } = build;

  // TODO: ap call to get each gene data from the gene number
  // becuase 'g' will be an array of numbers NOT an array of MonstieGene

  return {
    buildId: i,
    buildName: b,
    createdBy: c,
    monstie: m,
    geneBuild: CLEAN_EMPTY_BOARD,
  };
};

export const encodeGeneBuildToBase64Url = (build: GeneBuild) => {
  const str = JSON.stringify(shrinkGeneBuild(build));

  const encoded = base64url(str);

  return encoded;
};

export const decodeBase64UrlToGeneBuild = (
  url: string
): { error: any; build: GeneBuild } => {
  try {
    const decoded = base64url.decode(url);
    const shortenedGeneBuild: ShortGeneBuild = JSON.parse(decoded);

    const build = expandGeneBuild(shortenedGeneBuild);

    return { error: null, build };
  } catch (error) {
    return { error, build: { ...CORRUPTED_BUILD, buildId: nanoid() } };
  }
};
