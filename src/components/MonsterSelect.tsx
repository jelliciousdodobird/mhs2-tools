// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import supabase from "../utils/supabase";
import Portal from "./DynamicPortal";
import { PatternType } from "./Egg";

import { BiSearch } from "react-icons/bi";
import { useRef } from "react";
import { useLayoutEffect } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  max-height: 20rem;
`;

const ValueBox = styled.div`
  min-height: 3rem;

  border: 1px dashed;
`;

const PopoutMenuContainer = styled.div`
  position: fixed;
  top: 5rem;
  left: 0;

  padding: 5rem 0;

  width: 100%;
  max-width: 100%;

  height: calc(100vh - 5rem);

  overflow-x: hidden;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* HIDEs SCROLLBARS BUT STILL SCROLLABLE */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const FilterContainer = styled.div`
  position: sticky;
  top: 0;

  width: calc(100% - 2rem);
  max-width: 40rem;

  &:hover {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.primary.main};
      }
    }
  }
`;

const FilterInput = styled.input`
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;

  border-radius: 5rem;

  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(3px);
  width: 100%;

  color: black;

  font-size: 1.25rem;
  font-weight: 600;

  &::placeholder {
    font-size: inherit;
  }
`;

const SearchIcon = styled(BiSearch)`
  position: absolute;
  right: 0;
  top: 11px;
  margin-right: 1rem;

  width: 3rem;
  height: 3rem;

  path {
    fill: ${({ theme }) => theme.colors.primary.main};
    fill: gray;
  }

  /* border: 1px solid red; */
`;

const Select = styled(motion.ul)`
  color: black;
  color: white;
  width: 25rem;

  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

const Option = styled.li`
  cursor: pointer;

  display: flex;

  border-radius: 5px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};

    img {
      filter: brightness(0%);
    }
    p {
      color: black;
    }
  }
`;

const OptionText = styled.p`
  user-select: none;
  white-space: nowrap;

  padding: 1rem 1rem;

  color: white;
  font-size: 2rem;
  font-weight: 600;

  flex: 1;

  display: flex;
  align-items: center;
`;

const OptionImg = styled.img`
  width: 5rem;
  height: 5rem;

  padding: 0.5rem;

  border-radius: 5px;
`;

type InputProps = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const AutoFocusInput = ({ filter, setFilter }: InputProps) => {
  const filterSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    filterSearchRef.current?.focus();
  }, []);

  return (
    <FilterContainer>
      <FilterInput
        ref={filterSearchRef}
        placeholder="Filter monsters by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <SearchIcon />
    </FilterContainer>
  );
};

type SelectOption = {
  mId: number;
  monsterName: string;
  imgUrl: string;
  eggInfo: {
    patternType: PatternType;
    patterColor: string;
    bgColor: string;
    metaColors: string[];
  };
};

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const MonsterSelect = ({ value, setValue }: Props) => {
  const [monsterList, setMonsterList] = useState<SelectOption[]>([]);
  const [filter, setFilter] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(monsterList, {
        keys: ["monsterName"],
        includeScore: true,
        shouldSort: true,
        threshold: 0.3,
      }),
    [monsterList]
  );

  const renderList =
    filter === "" ? monsterList : fuse.search(filter).map(({ item }) => item);

  const selectMonster = monsterList.find((mon) => mon.mId === value);

  const toggleDropdown = () => {
    setDropdown((v) => !v);
  };

  useEffect(() => {
    const fetchMonsters = async () => {
      const { data, error } = await supabase
        .from("monsters")
        .select("m_id, monster_name, img_url, egg (*)")
        .eq("hatchable", true)
        .eq("statline.lvl", 1)
        .order("monster_name");

      if (data && !error) {
        const options: SelectOption[] = data.map((mon) => {
          const egg = mon.egg[0];

          return {
            mId: mon.m_id,
            monsterName: mon.monster_name,
            imgUrl: mon.img_url,
            eggInfo: {
              patternType: egg.pattern_type,
              patterColor: egg.pattern_color,
              bgColor: egg.bg_color,
              metaColors: egg.meta_colors,
            },
          };
        });
        setMonsterList(options);
      }

      if (error) console.error(error);
    };

    fetchMonsters();
  }, []);

  return (
    <Container>
      <ValueBox onClick={toggleDropdown}>{selectMonster?.monsterName}</ValueBox>

      {dropdown && (
        <Portal
          portalId="app"
          backdrop
          close={() => {
            setDropdown(false);
            setFilter("");
          }}
        >
          <PopoutMenuContainer
            onClick={(e) => {
              setDropdown(false);
              setFilter("");
            }}
          >
            <AutoFocusInput filter={filter} setFilter={setFilter} />
            <Select
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {renderList.map((mon) => (
                <Option
                  key={mon.mId}
                  onClick={() => {
                    setValue(mon.mId);
                    setDropdown(false);
                    setFilter("");
                  }}
                >
                  <OptionImg
                    src={`https://nvbiwqsofgmscfcufpfd.supabase.in/storage/v1/object/public/monster-img/${mon.imgUrl}`}
                  />
                  <OptionText>{mon.monsterName}</OptionText>
                </Option>
              ))}
              {renderList.length === 0 && (
                <Option
                  onClick={() => {
                    setFilter("");
                  }}
                >
                  <OptionText>No results.</OptionText>
                </Option>
              )}
            </Select>
          </PopoutMenuContainer>
        </Portal>
      )}
    </Container>
  );
};

export default MonsterSelect;
