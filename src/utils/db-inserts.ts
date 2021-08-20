import { GeneBuild } from "../components/MonstieGeneBuild";
import { geneBuildToSqlTableFormat } from "./db-transforms";
import supabase from "./supabase";

export const saveUserBuild = async (build: GeneBuild) => {
  const sqlForm = geneBuildToSqlTableFormat(build);
  const { error: error1 } = await supabase
    .from("buildinfo")
    .upsert([sqlForm.buildInfo]);

  const { error: error2 } = await supabase
    .from("buildpiece")
    .upsert(sqlForm.buildPieces);

  if (error1) console.error(error1);
  if (error2) console.error(error2);
};
