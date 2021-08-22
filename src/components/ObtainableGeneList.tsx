// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";

import React, { useState, useEffect } from "react";

import supabase from "../utils/supabase";

import { ElementType, AttackType } from "../utils/ProjectTypes";
import { GeneSkill } from "../utils/ProjectTypes";
import { PatternType } from "./Egg";
import { replaceNullOrUndefined as handleEmptiness } from "../utils/utils";

import MonstieToken from "./MonstieToken";
import Gene from "./Gene";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";
import { GiConsoleController } from "react-icons/gi";

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface.main};
  padding: 1rem;
  border-radius: 1rem;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 1rem;
`;

const HeaderContainer = styled.div`
  background-color: ${({ theme }) => `${theme.colors.surface.lighter}`};

  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

  border-radius: 5px;

  padding: 0.5rem 1rem;
`;

const Header = styled.h3`
  color: ${({ theme }) => theme.colors.onPrimary.main};
  font-weight: 600;
  margin-right: auto;
  text-align: center;
`;

const Button = styled.button`
  width: 2.5rem;
  height: 2.5rem;

  background-color: transparent;
  outline: none;

  border-radius: 10%;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: 1rem;
  padding: 0.3rem;

  svg {
    fill: ${({ theme }) => theme.colors.onBackground.main};
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const GeneList = styled(motion.div)<{ light: boolean }>`
  position: relative;
  background-color: ${({ light, theme }) =>
    light
      ? `${theme.colors.surface.lighter}`
      : `${theme.colors.background.main}`};
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  justify-content: center;

  gap: 1.5rem;

  padding: 1.5rem;

  border-left: 6px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 5px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.name === "light"
        ? `rgba(0, 0, 0, 0.05)`
        : `rgba(255, 255, 255, 0.1)`};
  }
`;

const GeneInfo = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  gap: 1rem;
`;

const MonstieList = styled(motion.ul)`
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;

  gap: 15px;
`;

const MinimizeButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 2rem;
  height: 2rem;

  background-color: transparent;
  outline: none;

  border-radius: 10%;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: 1rem;
  padding: 0.3rem;

  svg {
    fill: ${({ theme }) => theme.colors.onBackground.main};
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MinorText = styled.p`
  width: 100%;
  font-weight: 800;
`;

const pageVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 1,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};

const pageAnimation = {
  variants: pageVariants,
  initial: "enter",
  animate: "center",
  exit: "exit",
  transition: {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  },
};

const Separator = styled.div`
  background-color: ${({ theme }) => theme.colors.onSurface.main};
  width: 2px;
  height: auto;
`;

type ObtainableGeneListProps = { className?: string; genes: GeneSkill[] };

type Donors = {
  acquisition_type: string;
  gene: GeneSkill;
  monsters: object[];
};

type Monster = {
  mId: number;
  monsterName: string;
  ability1: string;
  ability2: string;
  elementStrength: ElementType;
  elementWeakness: ElementType;
  attackType: AttackType;
  genus: string;
  rarity: number;
  habitat: string;
  hatchable: boolean;
  retreatCondition: string;
  imgUrl: string;
};

type Egg = {
  mId: number;
  patternType: PatternType;
  bgColor: string;
  patternColor: string;
  metaColors: string[];
};

const sanitizeEggs = (dirtyEggs: any): Egg[] => {
  const uniqueMonsterEggId = [
    ...new Set(dirtyEggs.map((egg: any) => egg.m_id)),
  ];

  const eggsInFlatObject = uniqueMonsterEggId.map((mId, i) => {
    const egg = dirtyEggs.filter((egg: any) => egg.m_id === mId);

    const commonEggData = egg[0];

    let eggData: Egg = {
      mId: handleEmptiness(commonEggData.m_id, i - 1000),
      patternType: handleEmptiness(commonEggData.pattern_type, "question"),
      bgColor: handleEmptiness(commonEggData.bg_color, "#ffffff"),
      patternColor: handleEmptiness(commonEggData.pattern_color, "#000000"),
      metaColors: handleEmptiness(commonEggData.meta_colors, []),
    };
    return eggData;
  });
  return eggsInFlatObject;
};

const sanitizeMonsters = (dirtyMonsters: any): Monster[] => {
  const uniqueMonsterIds = [
    ...new Set(dirtyMonsters.map((mon: any) => mon.m_id)),
  ];

  const monstersInFlatObject = uniqueMonsterIds.map((mId, i) => {
    const monster = dirtyMonsters.filter((mon: any) => mon.m_id === mId);

    const attackStats = monster.find((mon: any) => mon.stat_type === "attack");
    const defenseStats = monster.find(
      (mon: any) => mon.stat_type === "defense"
    );
    const commonMonsterData = monster[0];

    let monsterData: Monster = {
      mId: handleEmptiness(commonMonsterData.m_id, i - 1000),
      monsterName: handleEmptiness(commonMonsterData.monster_name, ""),
      ability1: handleEmptiness(commonMonsterData.ability_1, ""),
      ability2: handleEmptiness(commonMonsterData.ability_2, ""),
      elementStrength: handleEmptiness(commonMonsterData.element_strength, ""),
      elementWeakness: handleEmptiness(commonMonsterData.element_weakness, ""),
      attackType: handleEmptiness(commonMonsterData.attack_type, ""),
      genus: handleEmptiness(commonMonsterData.genus, ""),
      rarity: handleEmptiness(commonMonsterData.rarity, 1),
      habitat: handleEmptiness(commonMonsterData.habitat, ""),
      hatchable: handleEmptiness(commonMonsterData.hatchable, false),
      retreatCondition: handleEmptiness(
        commonMonsterData.retreat_condition,
        ""
      ),
      imgUrl: handleEmptiness(commonMonsterData.img_url, ""),
    };

    return monsterData;
  });
  return monstersInFlatObject;
};

const ObtainableGeneList = ({ className, genes }: ObtainableGeneListProps) => {
  const [geneDonorsList, setGeneDonorsList] = useState<Donors[]>([]);
  const [showGeneList, setShowGeneList] = useState<
    { gId: number; show: boolean }[]
  >([]);

  useEffect(() => {
    const findMonstieDonors = async (genes: GeneSkill[]) => {
      let geneIds = genes.map((x) => x.gId).filter((x) => x >= 0);

      let { data, error } = await supabase
        .from("geneacquisition")
        .select(
          "acquisition_type, monster:monsters(*, egg(*)), gene:gene_skills(*)"
        )
        .in("g_id", geneIds);

      if (!error) {
        if (data && data.length > 0) {
          let cleanData: Donors[] = [];

          geneIds.map((geneId: number) => {
            if (
              !cleanData.some(
                (x) => x.gene !== undefined && x.gene.gId === geneId
              )
            ) {
              let gene = genes.find((gene) => gene.gId === geneId);
              if (gene !== undefined) {
                cleanData.push({
                  acquisition_type: "",
                  monsters: [],
                  gene: gene,
                });
              }
            }
          });

          data.map(
            (unit: {
              acquisition_type: string;
              monster: { egg: object };
              gene: any;
            }) => {
              if (
                cleanData.some(
                  (x) => x.gene !== undefined && x.gene.gId === unit.gene.g_id
                )
              ) {
                let index = cleanData.findIndex(
                  (x) => x.gene !== undefined && x.gene.gId === unit.gene.g_id
                );

                const { egg, ...monster } = unit.monster;
                cleanData[index].acquisition_type = unit.acquisition_type;
                cleanData[index].monsters.push({
                  egg: sanitizeEggs(egg)[0],
                  monstie: sanitizeMonsters([monster])[0],
                });
              }
            }
          );
          setGeneDonorsList(cleanData);
          calculateShowGeneList(cleanData);
        } else {
          setGeneDonorsList([]);
          calculateShowGeneList([]);
        }
      } else {
        console.error(error);
      }
    };

    const calculateShowGeneList = (newGeneDonorsList: Donors[]) => {
      let newShowGeneList = [...showGeneList];
      newGeneDonorsList.map((geneDonors) => {
        if (!newShowGeneList.some((x) => x.gId === geneDonors.gene.gId)) {
          newShowGeneList.push({ gId: geneDonors.gene.gId, show: true });
        }
      });
      newShowGeneList.map((geneList) => {
        if (!newGeneDonorsList.some((x) => x.gene.gId === geneList.gId)) {
          let removeIndex = newShowGeneList.findIndex(
            (x) => x.gId === geneList.gId
          );
          newShowGeneList.splice(removeIndex, 1);
        }
      });
      setShowGeneList(newShowGeneList);
    };

    findMonstieDonors(genes);
  }, [genes]);

  const minimize = (gId: number) => {
    let newShowGeneList = [...showGeneList];
    let changeIndex = newShowGeneList.findIndex((x) => x.gId === gId);
    newShowGeneList[changeIndex].show = !newShowGeneList[changeIndex].show;
    setShowGeneList(newShowGeneList);
  };

  const getVisibility = (gId: number): boolean => {
    let checkIndex = showGeneList.findIndex((x) => x.gId === gId);
    if (checkIndex >= 0) {
      return showGeneList[checkIndex].show;
    }
    return true;
  };

  const collapseAll = () => {
    let newShowGeneList = [...showGeneList];
    newShowGeneList.map((showList) => {
      showList.show = false;
    });
    setShowGeneList(newShowGeneList);
  };

  const expandAll = () => {
    let newShowGeneList = [...showGeneList];
    newShowGeneList.map((showList) => {
      showList.show = true;
    });
    setShowGeneList(newShowGeneList);
  };

  return (
    <Container className={className}>
      <HeaderContainer>
        <Header>Obtainable Genes</Header>
        <Button onClick={() => collapseAll()}>
          <BsArrowsCollapse />
        </Button>
        <Button onClick={() => expandAll()}>
          <BsArrowsExpand />
        </Button>
      </HeaderContainer>
      {geneDonorsList.map((geneDonors: Donors, index: number) => (
        <AnimatePresence key={index}>
          <GeneList light={index % 2 === 0} {...pageAnimation}>
            <MinimizeButton onClick={() => minimize(geneDonors.gene.gId)}>
              {getVisibility(geneDonors.gene.gId) ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </MinimizeButton>
            {getVisibility(geneDonors.gene.gId) ? (
              <React.Fragment>
                <GeneInfo>
                  <Gene size={100} gene={geneDonors.gene} />
                  {geneDonors.gene.geneName === "Rainbow Gene" ? null : (
                    <Header>
                      Gene Acquisition: {geneDonors.acquisition_type}
                    </Header>
                  )}
                </GeneInfo>

                <Separator />
                {geneDonors.gene.geneName === "Rainbow Gene" ? (
                  <MinorText>Huntable in All Monsties</MinorText>
                ) : (
                  <MonstieList>
                    {geneDonors.monsters.map((monster: any) => (
                      <li key={monster.monstie.mId}>
                        <MonstieToken
                          monstie={monster.monstie}
                          egg={monster.egg}
                          size={100}
                        ></MonstieToken>
                      </li>
                    ))}
                  </MonstieList>
                )}
              </React.Fragment>
            ) : (
              <MinorText>{geneDonors.gene.geneName}</MinorText>
            )}
          </GeneList>
        </AnimatePresence>
      ))}
    </Container>
  );
};

export default ObtainableGeneList;
