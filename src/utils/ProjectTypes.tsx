import color from "color";

export const ELEMENT_COLOR = {
  "non-elemental": {
    main: "#858585",
    light: "#949494",
    dark: "#6D6D6D",
    darker: "black",
  },
  // non_elemental: {
  //   main: "#858585",
  //   light: "#949494",
  //   dark: "#6D6D6D",
  //   darker: "black",
  // },
  // fire: { main: "#FB494A", light: "#fc6c6d", dark: "#FA191B", darker: "black" },
  fire: {
    main: "#FB494A",
    light: "#fc6c6d",
    dark: "#f30507",
    darker: "black",
  },
  water: {
    main: "#51ACFE",
    light: "#76befe",
    dark: "#1F94FE",
    darker: "black",
  },
  thunder: {
    main: "#FFCD4A",
    light: "#ffd76f",
    dark: "#EDAB00",
    darker: "black",
  },
  ice: { main: "#7EDEFF", light: "#a8e9ff", dark: "#32CBFF", darker: "black" },
  dragon: {
    main: "#C72EFF",
    light: "#d258ff",
    dark: "#A500E2",
    darker: "black",
  },
  rainbow: {
    main: "#49d0b0",
    light: "#49d0b0",
    dark: "#49d0b0",
    darker: "#49d0b0",
  },
  "": { main: "black", light: "black", dark: "black", darker: "black" },
};

// console.log(JSON.stringify(ELEMENT_COLOR));

export type ElementType = keyof typeof ELEMENT_COLOR;
// export type SkillType = "active" | "passive";
export type SkillType = "active" | "passive" | "";
export type AttackType = "power" | "technical" | "speed" | "";
// export type AttackType = "power" | "technical" | "speed";
export type StrictElement = Exclude<ElementType, "" | "rainbow">;
export type StrictAttack = Exclude<AttackType, "">;

export type Skill = {
  skillName: string;
  skillType: SkillType;
  desc: string;
};

export type MonstieGene = {
  geneName: string;
  geneNumber: number;
  attackType: AttackType;
  elementType: ElementType;
  requiredLvl: number;
  geneSize: number;
  skill: Skill;
  possessedBy: { native: string[]; random: string[] };
};
