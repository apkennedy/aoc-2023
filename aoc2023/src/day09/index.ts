import run from "aocrunner";
import sum from "lodash/sum.js";

const parseInput = (rawInput: string): number[][] => {
  return rawInput
    .split("\n")
    .map((x) => x.split(" ").map((n) => Number.parseInt(n)));
};

const getDiffs = (diffs: number[][]): number[][] => {
  const current = diffs[diffs.length - 1];
  const next = [];
  for (let i = 0; i < current.length - 1; i++) {
    next.push(current[i + 1] - current[i]);
  }
  diffs.push(next);
  if (sum(next) === 0) {
    return diffs;
  } else {
    return getDiffs(diffs);
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(
    input.map((sequence) =>
      getDiffs([sequence]).reduce((acc, curr) => {
        return (acc += curr[curr.length - 1]);
      }, 0),
    ),
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return sum(
    input.map((sequence) => {
      const sequences = getDiffs([sequence]);
      let newValues = [0];
      for (let i = 0; i < sequences.length - 1; ++i) {
        newValues.push(
          sequences[sequences.length - i - 2][0] -
            newValues[newValues.length - 1],
        );
      }
      return newValues.pop();
    }),
  );
};

run({
  part1: {
    tests: [
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45
        `,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

//8406 to high
