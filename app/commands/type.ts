import fs from "fs";
import { checkPathForBinary } from "../lib/path";

export async function type(commandName: string): Promise<void> {
  const paths = process.env.PATH?.split(":") as string[];

  if (["echo", "exit", "type"].includes(commandName)) {
    console.log(`${commandName} is a shell builtin`);
    return;
  }

  const pathResult = await checkPathForBinary(commandName);
  if (!pathResult.exists) { 
    console.log(`${commandName}: not found`);
    return;
  }

  console.log(`${commandName} is ${pathResult.dir}/${commandName}`)
  return ;
}
