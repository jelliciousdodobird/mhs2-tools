// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { useState, useMemo, useEffect, useRef } from "react";

// data:
import DATA from "../utils/output.json";

// custom components:
import Table from "../components/Table";

const LvlSelectorButton = styled.button`
  background-color: ${({ theme }) => theme.colors.onBackground.main};
  padding: 1rem;
  margin: 1px;

  color: ${({ theme }) => theme.colors.background.main};
`;

const MonstiesPage = () => {
  const [lvl, setLvl] = useState(1);
  const [data, setData] = useState(DATA.monsties);
  const column = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        width: 150,
      },
      { key: "type", label: "Type", width: 90 },
      { key: "ability1", label: "Ability 1", width: 100 },
      { key: "ability2", label: "Ability 2", width: 100 },
      { key: "speed", label: "Sp", width: 50 },

      { key: "hp", label: "HP", width: 50 },
      { key: "recovery", label: "Rec", width: 60 },

      { key: "atk_non_elemental", label: "Non Elemental Attack", width: 50 },
      { key: "atk_fire", label: "Fire Attack", width: 50 },
      { key: "atk_water", label: "Water Attack", width: 50 },
      { key: "atk_thunder", label: "Thunder Attack", width: 50 },
      { key: "atk_ice", label: "Ice Attack", width: 50 },
      { key: "atk_dragon", label: "Dragon Attack", width: 50 },

      { key: "def_non_elemental", label: "Non Elemental Defense", width: 50 },
      { key: "def_fire", label: "Fire Defense", width: 50 },
      { key: "def_water", label: "Water Defense", width: 50 },
      { key: "def_thunder", label: "Thunder Defense", width: 50 },
      { key: "def_ice", label: "Ice Defense", width: 50 },
      { key: "def_dragon", label: "Dragon Defense", width: 50 },
    ],
    []
  );

  useEffect(() => {
    const stats = DATA.monsties;
    const newStats = stats.map((monstie, i) => {
      // const lvlStats = [];

      const statline = monstie.stats.find((statline) => statline.lvl === lvl);

      return {
        ...monstie,
        lvl: statline?.lvl,
        hp: statline?.hp,
        recovery: statline?.recovery,

        atk_non_elemental: statline?.attack.non_elemental,
        atk_fire: statline?.attack.fire,
        atk_water: statline?.attack.water,
        atk_thunder: statline?.attack.thunder,
        atk_ice: statline?.attack.ice,
        atk_dragon: statline?.attack.dragon,

        def_non_elemental: statline?.defense.non_elemental,
        def_fire: statline?.defense.fire,
        def_water: statline?.defense.water,
        def_thunder: statline?.defense.thunder,
        def_ice: statline?.defense.ice,
        def_dragon: statline?.defense.dragon,
      };
    });

    setData(newStats);
  }, [lvl]);

  return (
    <>
      <LvlSelectorButton
        onClick={() => {
          setLvl(1);
        }}
      >
        1
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(10);
        }}
      >
        10
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(20);
        }}
      >
        20
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(30);
        }}
      >
        30
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(40);
        }}
      >
        40
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(50);
        }}
      >
        50
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(75);
        }}
      >
        75
      </LvlSelectorButton>
      <LvlSelectorButton
        onClick={() => {
          setLvl(99);
        }}
      >
        99
      </LvlSelectorButton>
      <Table data={data} column={column} />
    </>
  );
};

export default MonstiesPage;
