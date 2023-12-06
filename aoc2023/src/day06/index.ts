import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const multiSpaceExp = /\s\s+/g;
  const cleansedInput = rawInput.replace(multiSpaceExp, " ");
  const [timeRow, distanceRow] = cleansedInput.split("\n");
  const times = timeRow.split(":")[1].trim().split(" ");
  const distances = distanceRow.split(":")[1].trim().split(" ");
  const races = [];
  times.forEach((time, index) => {
    races.push({ time: time, distance: distances[index] });
  });
  return races;
};

// a = 1
// v = pa
// t = m + p
// d = v * m
// --------------
// d = p * (t-p)
// 0 = p^2 -tp + d
// get intercepts d + 1 (winning distance) and find integers in between
const getIntercepts = (distance, time) => {
  // (-b±√(b²-4ac))/(2a)
  const min = Math.ceil(
    (time - Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2,
  );
  const max = Math.floor(
    (time + Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2,
  );
  return { min, max };
};

const part1 = (rawInput: string) => {
  const races = parseInput(rawInput);

  return races.reduce((acc, race) => {
    const intercepts = getIntercepts(
      Number.parseInt(race.distance) + 1,
      Number.parseInt(race.time),
    );
    return acc * (intercepts.max - intercepts.min + 1);
  }, 1);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let time = "";
  let distance = "";

  input.forEach((race) => {
    time += race.time;
    distance += race.distance;
  });

  const intercepts = getIntercepts(
    Number.parseInt(distance) + 1,
    Number.parseInt(time),
  );
  return intercepts.max - intercepts.min + 1;
};

run({
  part1: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200
        `,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200
        `,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
