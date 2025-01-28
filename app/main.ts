import { createInterface } from "readline";
import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { type } from "./commands/type";
import { echo } from "./commands/echo";
import { checkPathForBinary } from "./lib/path";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function loop(retCode?: number) {
  rl.question("$ ", async (answer) => {
    const args = answer.split(" ");

    if (retCode && retCode > 0) {
      console.log("exit code %s", retCode);
    }

    // exit command
    if (args[0] == "exit") {
      rl.close();
      return 0;
    }

    // echo command
    if (args[0] == "echo") {
      args.shift();
      echo(args.join(" ")).finally(loop);
      return;
    }

    // type command
    if (args[0] == "type") {
      type(args[1]).finally(loop);
      return;
    }

    // handle system commands (not builtins)
    const inputCmd = args[0];

    // handle empty command
    if (inputCmd.length < 1) {
      loop();
      return;
    }

    // Check if requested binary exists within path.
    if (!(await checkPathForBinary(args[0]))) {
      console.log(`${inputCmd}: command not found`);
      loop();
      return;
    }
  
    args.shift(); // Remove the first arg (the cmd) to provide other args to process

    let process: ChildProcessWithoutNullStreams;
    try {
      process = spawn(inputCmd, args);

      process.stdout.on("data", (data: string) => {
        const output = data.toString().trimEnd();
        console.log(output);
        return;
      });

      process.stderr.on("data", (data) => {
        const output = data.toString().trimEnd();
        console.log(output);
        return;
      });

      process.on("close", (code) => {
        loop(code as number);
        return;
      });
    } catch (err) {
      if (err instanceof Error) {
        let code = (err as NodeJS.ErrnoException).code;
        // if (code == "ENOENT" || code == "ERR_INVALID_ARG_TYPE") {
        //   console.log(`${inputCmd}: command not found`);
        // }
        
        console.error(err)
      }
      loop();
      return;
    }
  });
}

loop();
