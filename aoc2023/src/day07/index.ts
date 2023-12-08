import run from "aocrunner";
import countBy from "lodash/countBy.js";
import groupBy from "lodash/groupBy.js";
import sortBy from "lodash/sortBy.js";
import max from "lodash/max.js";

type Hand = {
  cards: string[];
  value?: number;
  bid: number;
  strength?: number;
};

const parseInput = (rawInput: string): Hand[] => {
  const unparsedHands = rawInput.split("\n");
  const hands = unparsedHands.map((h) => {
    const [unparsedHand, bid] = h.split(" ");
    return {
      cards: unparsedHand.split(""),
      bid: Number.parseInt(bid),
    };
  }, {});

  return hands;
};

const part1 = (rawInput: string) => {
  let hands = parseInput(rawInput);

  const cardStrength = {
    A: 30,
    K: 29,
    Q: 28,
    J: 27,
    T: 26,
    "9": 25,
    "8": 24,
    "7": 23,
    "6": 22,
    "5": 21,
    "4": 20,
    "3": 19,
    "2": 18,
  };

  const typeStrength = {
    "5": 7,
    "41": 6,
    "32": 5,
    "311": 4,
    "221": 3,
    "2111": 2,
    "11111": 1,
  };

  hands = hands.map((hand) => {
    const groupCountsDesc = Object.values(countBy(hand.cards)).sort().reverse();
    hand.strength = typeStrength[groupCountsDesc.join("")];

    hand.value = Number.parseInt(
      hand.cards.reduce((acc, card) => {
        return `${acc}${cardStrength[card]}`;
      }, ""),
    );
    return hand;
  });

  const handsByStrength = groupBy(hands, "strength");
  const rankedHands = [];

  Object.keys(handsByStrength)
    .sort()
    .reverse()
    .forEach((key) => {
      const hands = handsByStrength[key] as Hand[];
      rankedHands.push(...sortBy(hands, "value").reverse());
    });

  return rankedHands.reverse().reduce((acc, curr, index) => {
    return acc + curr.bid * (index + 1);
  }, 0);
};

const part2 = (rawInput: string) => {
  let hands = parseInput(rawInput);
  const cardStrength = {
    A: 30,
    K: 29,
    Q: 28,
    T: 26,
    "9": 25,
    "8": 24,
    "7": 23,
    "6": 22,
    "5": 21,
    "4": 20,
    "3": 19,
    "2": 18,
    J: 17,
  };

  const typeStrength = {
    "5": 7,
    "41": 6,
    "32": 5,
    "311": 4,
    "221": 3,
    "2111": 2,
    "11111": 1,
  };

  hands = hands.map((hand) => {
    const groupCountsDesc = Object.values(countBy(hand.cards)).sort().reverse();
    let strength = typeStrength[groupCountsDesc.join("")];
    if (strength == 6 && hand.cards.includes("J")) {
      hand.strength = 7;
    } else if (strength == 5 && hand.cards.includes("J")) {
      hand.strength = 7;
    } else if (strength == 4 && hand.cards.includes("J")) {
      hand.strength = 6;
    } else if (
      strength == 3 &&
      hand.cards.filter((x) => x === "J").length === 1
    ) {
      hand.strength = 5;
    } else if (
      strength == 3 &&
      hand.cards.filter((x) => x === "J").length === 2
    ) {
      hand.strength = 6;
    } else if (strength == 2 && hand.cards.includes("J")) {
      hand.strength = 4;
    } else if (strength == 1 && hand.cards.includes("J")) {
      hand.strength = 2;
    } else {
      hand.strength = strength;
    }

    hand.value = Number.parseInt(
      hand.cards.reduce((acc, card) => {
        return `${acc}${cardStrength[card]}`;
      }, ""),
    );
    return hand;
  });

  const handsByStrength = groupBy(hands, "strength");
  const rankedHands = [];

  Object.keys(handsByStrength)
    .sort()
    .reverse()
    .forEach((key) => {
      const hands = handsByStrength[key] as Hand[];
      rankedHands.push(...sortBy(hands, "value").reverse());
    });

  return rankedHands.reverse().reduce((acc, curr, index) => {
    return acc + curr.bid * (index + 1);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
        `,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2345A 1
        Q2KJJ 13
        Q2Q2Q 19
        T3T3J 17
        T3Q33 11
        2345J 3
        J345A 2
        32T3K 5
        T55J5 29
        KK677 7
        KTJJT 34
        QQQJA 31
        JJJJJ 37
        JAAAA 43
        AAAAJ 59
        AAAAA 61
        2AAAA 23
        2JJJJ 53
        JJJJ2 41
        `,
        expected: 6839,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
