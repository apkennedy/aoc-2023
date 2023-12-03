import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

//char ranges exlcuding '.' = 32-45, 58-64, 91-96, 123-126
const isAsciiSymbol = (char: string) =>
  (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 45) ||
  char.charCodeAt(0) == 47 ||
  (char.charCodeAt(0) >= 58 && char.charCodeAt(0) <= 64) ||
  (char.charCodeAt(0) >= 91 && char.charCodeAt(0) <= 96) ||
  (char.charCodeAt(0) >= 123 && char.charCodeAt(0) <= 126);

const isAsciiNumber = (char: string) =>
  char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;

type Coord = { x: number; y: number };
type Part = {
  xStart: number;
  xEnd: number;
  y: number;
  value: string;
};

type SymbolNode = {
  x: number;
  y: number;
};

let lines;
let xLength;
let yLength;

const getPartNumber = (
  part: Part,
  { x, y }: Coord,
  mostSignigicant: boolean,
): Part => {
  const char = lines[y][x];
  if (mostSignigicant) {
    if (isAsciiNumber(char)) {
      part.value = `${part.value}${char}`;
      part.xEnd = x;
      if (x == xLength - 1) {
        return part;
      }
      return getPartNumber(part, { x: x + 1, y }, mostSignigicant);
    } else {
      return part;
    }
  } else {
    if (isAsciiNumber(char)) {
      part.value = `${char}${part.value}`;
      if (x == 0) {
        part.xStart = x;
        return part;
      }
      return getPartNumber(part, { x: x - 1, y }, mostSignigicant);
    } else {
      part.xStart = x + 1;
      return part;
    }
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const parts = [];
  const symbols = [];
  lines = rawInput.split("\n").map((line) => line.split(""));
  xLength = lines[0].length;
  yLength = lines.length;

  lines.forEach((line: string[], y) => {
    line.forEach((char: string, x: number) => {
      if (isAsciiSymbol(char)) {
        symbols.push({
          x,
          y,
        });
      }
    });
  });

  symbols.forEach(({ x, y }: SymbolNode) => {
    const xMin = x - 1 >= 0 ? x - 1 : 0;
    const yMin = y - 1 >= 0 ? y - 1 : 0;
    const xMax = x + 1 < xLength ? x + 1 : xLength - 1;
    const yMax = y + 1 < yLength ? y + 1 : yLength - 1;

    for (let y = yMin; y <= yMax; ++y) {
      let x = xMin;
      while (x <= xMax) {
        if (isAsciiNumber(lines[y][x])) {
          let part = getPartNumber(
            {
              value: lines[y][x],
              xStart: x,
              xEnd: x,
              y,
            },
            { x: x + 1, y },
            true,
          );
          if (x - 1 >= 0) {
            part = getPartNumber(part, { x: x - 1, y }, false);
          }
          parts.push(part);
          x = part.xEnd + 1;
        } else {
          x += 1;
        }
      }
    }
  });

  return parts.reduce((sum, part) => {
    return (sum += Number.parseInt(part.value));
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const gearRatios = [];
  const symbols = [];
  lines = rawInput.split("\n").map((line) => line.split(""));
  xLength = lines[0].length;
  yLength = lines.length;

  lines.forEach((line: string[], y) => {
    line.forEach((char: string, x: number) => {
      if (char === "*") {
        symbols.push({
          x,
          y,
        });
      }
    });
  });

  symbols.forEach(({ x, y }: SymbolNode) => {
    const xMin = x - 1 >= 0 ? x - 1 : 0;
    const yMin = y - 1 >= 0 ? y - 1 : 0;
    const xMax = x + 1 < xLength ? x + 1 : xLength - 1;
    const yMax = y + 1 < yLength ? y + 1 : yLength - 1;
    const cogs = [];
    for (let y = yMin; y <= yMax; ++y) {
      let x = xMin;
      while (x <= xMax) {
        if (isAsciiNumber(lines[y][x])) {
          let part = getPartNumber(
            {
              value: lines[y][x],
              xStart: x,
              xEnd: x,
              y,
            },
            { x: x + 1, y },
            true,
          );
          if (x - 1 >= 0) {
            part = getPartNumber(part, { x: x - 1, y }, false);
          }
          cogs.push(part);
          x = part.xEnd + 1;
        } else {
          x += 1;
        }
      }
    }
    if (cogs.length >= 2) {
      gearRatios.push(
        cogs.reduce((ratio, cog) => ratio * Number.parseInt(cog.value), 1),
      );
    }
  });

  return gearRatios.reduce((sum, ratio) => {
    return (sum += ratio);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
        `,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
