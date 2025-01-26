import { createInterface } from "readline";
import { type } from "./commands/type";
import { echo } from "./commands/echo";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function loop() {
  rl.question("$ ", (answer) => {
    const args = answer.split(" ");

    if (args[0] == "exit") {
      rl.close();
      return;
    }

    if (args[0] == "echo") {
      args.shift(); 
      echo(args.join(" ")).finally(loop)
      return;
    }

    if (args[0] == "type") {
      type(args[1]).finally(loop);
      return;
    }

    if (args[0].length > 0) {
      console.log(`${args[0]}: command not found`);
    }

    loop();
  });
}

loop();
