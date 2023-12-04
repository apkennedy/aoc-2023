import run from "aocrunner";

type Card = {
  id: string;
  numbersToMatch: string[];
  numbers: { [key: string]: string };
  winners: string[];
  cardCount: number;
};

const parseInput = (rawInput: string): Card[] => {
  const multiSpaceExp = /\s\s+/g;
  const cleansedInput = rawInput.replace(multiSpaceExp, " ");
  const unparsedCards = cleansedInput.split("\n");
  return unparsedCards.map((c) => {
    const [cardMeta, allNumbers] = c.split(": ");
    const [_, cardId] = cardMeta.split(" ");
    const [unparsedNumbersToMatch, unparsedNumbers] = allNumbers.split(" | ");
    const numbers = unparsedNumbers.split(" ").reduce((acc, num) => {
      acc[num] = num;
      return acc;
    }, {});
    return {
      id: cardId,
      numbersToMatch: unparsedNumbersToMatch.split(" "),
      numbers,
      winners: [],
      cardCount: 1,
    };
  });
};

const part1 = (rawInput: string) => {
  const cards = parseInput(rawInput);
  return cards.reduce((points, card) => {
    const matches = card.numbersToMatch.reduce(
      (cardWinnerCount, numberToMatch) => {
        if (card.numbers[numberToMatch]) {
          card.winners.push(numberToMatch);
          return cardWinnerCount + 1;
        }
        return cardWinnerCount;
      },
      0,
    );
    return points + (matches <= 0 ? 0 : Math.pow(2, matches - 1));
  }, 0);
};

const part2 = (rawInput: string) => {
  const cards = parseInput(rawInput);
  cards.forEach((card, index) => {
    card.numbersToMatch.forEach((numberToMatch) => {
      if (card.numbers[numberToMatch]) {
        card.winners.push(numberToMatch);
      }
    });

    for (
      let i = index + 1;
      i <= index + card.winners.length && i < cards.length;
      ++i
    ) {
      cards[i].cardCount += 1 * card.cardCount;
    }
  });
  return cards.reduce((total, card) => (total += card.cardCount), 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
