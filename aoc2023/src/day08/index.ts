import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [commands, _, ...rows] = rawInput.split("\n");
  const nodes = rows.reduce((acc, curr) => {
    const [key, node] = curr.split(" = ");
    const [L, R] = node.replace("(", "").replace(")", "").split(", ");
    acc[key] = { L, R };
    return acc;
  }, {});

  return { commands: commands.split(""), nodes };
};

const part1 = (rawInput: string) => {
  //doing the dumb thing
  const input = parseInput(rawInput);
  let value = "AAA";
  let commandCount = 0;
  do {
    value =
      input.nodes[value][input.commands[commandCount % input.commands.length]];
    commandCount += 1;
  } while (value !== "ZZZ");
  return commandCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const startNodes = Object.keys(input.nodes).filter((x) => x.endsWith("A"));
  const steps = [];

  startNodes.forEach((node) => {
    let commandCount = 0;
    let zFound = false;
    let start = node;
    let value = node;
    do {
      value =
        input.nodes[value][
          input.commands[commandCount % input.commands.length]
        ];
      if (value.endsWith("Z")) {
        zFound = true;
      }
      commandCount += 1;
    } while (!zFound && start !== value);
    steps.push(commandCount);
  });

  const gcd = (a, b) => {
    return !b ? a : gcd(b, a % b);
  };

  const lcm = (numbers: number[]) => {
    return numbers.reduce((acc, curr) => (acc * curr) / gcd(acc, curr), 1);
  };

  return lcm(steps);
};

run({
  part1: {
    tests: [
      {
        input: `
        LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)
        `,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        LR

        11A = (11B, XXX)
        11B = (XXX, 11Z)
        11Z = (11B, XXX)
        22A = (22B, XXX)
        22B = (22C, 22C)
        22C = (22Z, 22Z)
        22Z = (22B, 22B)
        XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
