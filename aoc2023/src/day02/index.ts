import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  const gamePieceCounts = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const isGameValid = (unparsedTurns: string[]) => {
    let isValid = true;
    for (let unparsedTurn of unparsedTurns) {
      const turnData = unparsedTurn.split(",");
      //find invalid turn
      if (
        turnData.find((data: string) => {
          const [count, color] = data.trim().split(" ");
          return gamePieceCounts[color] < Number.parseInt(count?.trim());
        })
      ) {
        isValid = false;
      }
    }
    return isValid;
  };

  const parseLineToGame = (line: string) => {
    const [unparsedGameId, unparsedTurns] = line.split(":");
    const gameId = unparsedGameId.split(" ").pop();
    if (isGameValid(unparsedTurns.split(";"))) {
      return Number.parseInt(gameId);
    }
    return 0;
  };

  return lines.reduce((sum, line) => {
    let id = parseLineToGame(line);
    return sum + id;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  const getGamePower = (unparsedTurns: string[]): number => {
    let minCubes = {
      blue: 1,
      green: 1,
      red: 1,
    };
    for (let unparsedTurn of unparsedTurns) {
      const turnData = unparsedTurn.split(",");

      turnData.forEach((data: string) => {
        const [count, color] = data.trim().split(" ");
        if (minCubes[color] < Number.parseInt(count?.trim())) {
          minCubes[color] = Number.parseInt(count?.trim());
        }
      });
    }
    return minCubes.red * minCubes.blue * minCubes.green;
  };

  const parseLineToGame = (line: string) => {
    const [unparsedGameId, unparsedTurns] = line.split(":");
    return getGamePower(unparsedTurns.split(";"));
  };

  return lines.reduce((sum, line) => {
    let gamePower = parseLineToGame(line);
    return sum + gamePower;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
