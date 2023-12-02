import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const values = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 0,
  };

  const getLineCalibration = (line) => {
    const matches = [];
    for (let stringIndex = 0; stringIndex < line.length; ++stringIndex) {
      if (values[line.substring(stringIndex, stringIndex + 1)]) {
        matches.push(values[line.substring(stringIndex, stringIndex + 1)]);
      }
    }
    return matches[0] * 10 + matches[matches.length - 1];
  };

  const calibrations = [];
  const lines = input.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; ++lineIndex) {
    calibrations.push(getLineCalibration(lines[lineIndex]));
  }

  return calibrations.reduce((sum, curr) => (sum += curr), 0);
};

const part2 = (rawInput: string) => {
  const MAX_LENGTH = 5;
  const input = parseInput(rawInput);
  const values = {
    1: { value: 1, length: 1 },
    2: { value: 2, length: 1 },
    3: { value: 3, length: 1 },
    4: { value: 4, length: 1 },
    5: { value: 5, length: 1 },
    6: { value: 6, length: 1 },
    7: { value: 7, length: 1 },
    8: { value: 8, length: 1 },
    9: { value: 9, length: 1 },
    0: { value: 0, length: 1 },
    one: { value: 1, length: 3 },
    two: { value: 2, length: 3 },
    three: { value: 3, length: 5 },
    four: { value: 4, length: 4 },
    five: { value: 5, length: 4 },
    six: { value: 6, length: 3 },
    seven: { value: 7, length: 5 },
    eight: { value: 8, length: 5 },
    nine: { value: 9, length: 4 },
    zero: { value: 0, length: 4 },
  };

  const findMatchingSubstring = (line) => {
    const maxLength = MAX_LENGTH < line.length ? MAX_LENGTH : line.length;
    let value = undefined;
    for (let i = 0; i <= maxLength; ++i) {
      if (values[line.substring(0, i)]) {
        value = values[line.substring(0, i)];
        break;
      }
    }
    return value;
  };

  const getLineCalibration = (line) => {
    const matches = [];
    let startingIndex = 0;
    while (startingIndex < line.length) {
      const result = findMatchingSubstring(line.substring(startingIndex));
      if (result) {
        matches.push(result.value);
        //stupid elf threeight
        startingIndex += result.length > 1 ? result.length - 1 : result.length;
      } else {
        ++startingIndex;
      }
    }
    return matches[0] * 10 + matches[matches.length - 1];
  };

  const calibrations = [];
  const lines = input.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; ++lineIndex) {
    calibrations.push(getLineCalibration(lines[lineIndex]));
  }

  return calibrations.reduce((sum, curr) => (sum += curr), 0);
};

run({
  part1: {
    tests: [
      {
        input: `
                1abc2
                pqr3stu8vwx
                a1b2c3d4e5f
                treb7uchet
                xkvsone2
              `,
        expected: 164,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
                threeight
              `,
        expected: 38,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
