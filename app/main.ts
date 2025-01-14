import { createInterface } from "readline";
import os from "node:os"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loop() {
  rl.question("$ ", (answer) => {
    const args = answer.split(" ")

    if (args[0] == "exit") {
      rl.close();

      return;
    }

    if (args[0] == "echo") {
      args.shift() // Remove the command from the first idx.
      console.log(args.join(" ")) // Print out the args.

      loop();

      return;
    }

    if (args[0] == "type") {
      if (['echo', 'exit', 'type'].includes(args[1])) {
        console.log(`${args[1]} is a shell builtin`)
      }

      loop();
      return;
    }

    console.log(`${answer}: command not found`);

    loop();
  });
}

loop();
