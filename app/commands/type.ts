import fs from "fs";

export async function type(commandName: string): Promise<void> {
  const paths = process.env.PATH?.split(":") as string[];

  if (["echo", "exit", "type"].includes(commandName)) {
    console.log(`${commandName} is a shell builtin`);
    return;
  }

  for (const dir of paths) {
    // Check if opening a dir throws. If it does, the dir can be ignored.
    try {
      await fs.promises.opendir(dir);
    } catch (e) {
      continue;
    }

    let lastPath;
    // Open the path
    for await (const d of await fs.promises.opendir(dir)) {
      lastPath = dir;

      if (d.name == commandName) {
        console.log(`${d.name} is ${lastPath}/${d.name}`);
        return;
      }
    }
  }

  console.log(`type: Could not find '${commandName}'`);
  return;
}
