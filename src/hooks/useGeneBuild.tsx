import { useEffect } from "react";
import { memo } from "react";
import { useState } from "react";
import { GeneSkill } from "../utils/ProjectTypes";
import { cleanGeneBuild } from "../utils/utils";

const useGeneBuild = (initialGeneBuild: GeneSkill[]) => {
  const [geneBuild, setGeneBuild] = useState<GeneSkill[]>(
    cleanGeneBuild(initialGeneBuild)
  );

  useEffect(() => {
    console.log("first", initialGeneBuild);

    setGeneBuild(cleanGeneBuild(initialGeneBuild));
  }, []);

  useEffect(() => {
    console.log("initialGeneBuild", initialGeneBuild);
    setGeneBuild(cleanGeneBuild(initialGeneBuild));
  }, [initialGeneBuild]);

  return { geneBuild, setGeneBuild };
};

export default useGeneBuild;
