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
      return 0;
    }

    console.log(`${answer}: command not found`);

    loop();
  });
}

loop();
