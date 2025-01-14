import { createInterface } from "readline";

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

    console.log(`${answer}: command not found`);

    loop();
  });
}

loop();
