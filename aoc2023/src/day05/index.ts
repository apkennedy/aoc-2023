import run from "aocrunner";

type Range = {
  start: number;
  end: number;
};

type Maping = {
  source: Range;
  destination: Range;
  offset: number;
};

type MapData = {
  type: string;
  maps: Maping[];
};

const MAP_TYPES = [
  "seed-to-soil map:",
  "soil-to-fertilizer map:",
  "fertilizer-to-water map:",
  "water-to-light map:",
  "light-to-temperature map:",
  "temperature-to-humidity map:",
  "humidity-to-location map:",
];

const parseInput = (
  input: string,
): { seeds: number[]; maps: { [key: string]: MapData } } => {
  const mapData: { [key: string]: MapData } = {
    "seed-to-soil map:": { type: "seed-to-soil map:", maps: [] },
    "soil-to-fertilizer map:": { type: "soil-to-fertilizer map:", maps: [] },
    "fertilizer-to-water map:": { type: "fertilizer-to-water map:", maps: [] },
    "water-to-light map:": { type: "water-to-light map:", maps: [] },
    "light-to-temperature map:": {
      type: "light-to-temperature map:",
      maps: [],
    },
    "temperature-to-humidity map:": {
      type: "temperature-to-humidity map:",
      maps: [],
    },
    "humidity-to-location map:": {
      type: "humidity-to-location map:",
      maps: [],
    },
  };
  if (input) {
    const mapIdentifiers = [...MAP_TYPES];

    const seeds = input
      .slice(0, input.indexOf(mapIdentifiers[0]))
      .trim()
      .split(": ")[1]
      ?.split(" ")
      .map((x) => Number.parseInt(x));

    const parseMaps = (data: {
      input: string;
      currIdIndex: number;
      mapIds: string[];
      dataMaps: { [key: string]: MapData };
    }) => {
      const { input, currIdIndex, dataMaps } = data;
      const mapIds = [...data.mapIds];
      const nextId = mapIds.shift();
      if (nextId) {
        const nextIdIndex = input.indexOf(nextId);
        const rawData = input.slice(currIdIndex, nextIdIndex).trim();
        const [mapId, ...mapData] = rawData.split("\n");
        mapData.forEach((mapping) => {
          const destinationMin = Number.parseInt(mapping.split(" ")[0].trim());
          const sourceMin = Number.parseInt(mapping.split(" ")[1].trim());
          const range = Number.parseInt(mapping.split(" ")[2].trim());

          dataMaps[mapId].maps.push({
            destination: {
              start: destinationMin,
              end: destinationMin + range - 1,
            },
            source: { start: sourceMin, end: sourceMin + range - 1 },
            offset: destinationMin - sourceMin,
          });
        });
        return parseMaps({ input, currIdIndex: nextIdIndex, mapIds, dataMaps });
      } else {
        const nextIdIndex = input.length;
        const rawData = input.slice(currIdIndex, nextIdIndex).trim();
        const [mapId, ...mapData] = rawData.split("\n");
        mapData.forEach((mapping) => {
          const destinationMin = Number.parseInt(mapping.split(" ")[0].trim());
          const sourceMin = Number.parseInt(mapping.split(" ")[1].trim());
          const range = Number.parseInt(mapping.split(" ")[2].trim());

          dataMaps[mapId].maps.push({
            destination: {
              start: destinationMin,
              end: destinationMin + range - 1,
            },
            source: { start: sourceMin, end: sourceMin + range - 1 },
            offset: destinationMin - sourceMin,
          });
        });
        return dataMaps;
      }
    };

    const maps = parseMaps({
      input,
      currIdIndex: input.indexOf(mapIdentifiers.shift()),
      mapIds: mapIdentifiers,
      dataMaps: mapData,
    });

    return {
      seeds,
      maps,
    };
  }
};

const part1 = (rawInput: string) => {
  const { seeds, maps } = parseInput(rawInput);
  let minLocation = undefined;

  for (let s = 0; s < seeds.length; ++s) {
    let source = seeds[s];
    for (let i = 0; i < MAP_TYPES.length; ++i) {
      const mappings = maps[MAP_TYPES[i]];
      for (let m = 0; m < mappings.maps.length; ++m) {
        const map = mappings.maps[m];
        if (source >= map.source.start && source <= map.source.end) {
          let destination = source + map.offset;
          source = destination;
          break;
        }
      }
    }
    if (minLocation && source < minLocation) {
      minLocation = source;
    } else if (!minLocation) {
      minLocation = source;
    }
  }

  return minLocation;
};

const part2 = (rawInput: string) => {
  const { seeds, maps } = parseInput(rawInput);
  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({ start: seeds[i], end: seeds[i] + seeds[i + 1] - 1 });
  }

  const getIntersection = (a: Range, b: Range) => {
    const minStart: Range = a.start < b.start ? a : b;
    const maxStart: Range = minStart == a ? b : a;

    if (minStart.end < maxStart.start) {
      return undefined; //no intersection
    }

    return {
      start: maxStart.start,
      end: minStart.end < maxStart.end ? minStart.end : maxStart.end,
    };
  };

  const getMappings = (
    source: Range,
    mappingIndex,
    mappings: Maping[],
    destinations: Range[],
  ) => {
    if (mappingIndex >= mappings.length) {
      if (source) {
        destinations.push(source);
        return destinations;
      }
    } else {
      const map = mappings[mappingIndex];
      const intersection = getIntersection(source, map.source);
      if (intersection) {
        let destination = {
          start: intersection.start + map.offset,
          end: intersection.end + map.offset,
        };

        if (source.start < intersection.start) {
          destinations.push(
            ...getMappings(
              {
                start: source.start,
                end: intersection.start - 1,
              },
              mappingIndex + 1,
              mappings,
              [],
            ),
          );
        }

        destinations.push(destination);

        if (source.end > intersection.end) {
          destinations.push(
            ...getMappings(
              {
                start: intersection.end + 1,
                end: source.end,
              },
              mappingIndex + 1,
              mappings,
              [],
            ),
          );
        }
      } else {
        destinations.push(
          ...getMappings(source, mappingIndex + 1, mappings, []),
        );
      }
      return destinations;
    }
  };

  let minLocation = undefined;
  for (let s = 0; s < seedRanges.length; ++s) {
    let sources = [seedRanges[s]];
    for (let i = 0; i < MAP_TYPES.length; ++i) {
      const mappings = maps[MAP_TYPES[i]];
      let destinations = [];
      for (let s = 0; s < sources.length; ++s) {
        let source = sources[s];
        destinations.push(...getMappings(source, 0, mappings.maps, []));
      }
      sources = destinations;
    }

    sources.forEach((source) => {
      if (!minLocation) {
        minLocation = source.start;
      } else if (minLocation > source.start) {
        minLocation = source.start;
      }
    });
  }

  return minLocation;
};

run({
  part1: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48

        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15

        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4

        water-to-light map:
        88 18 7
        18 25 70

        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13

        temperature-to-humidity map:
        0 69 1
        1 0 69

        humidity-to-location map:
        60 56 37
        56 93 4
        `,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48

        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15

        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4

        water-to-light map:
        88 18 7
        18 25 70

        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13

        temperature-to-humidity map:
        0 69 1
        1 0 69

        humidity-to-location map:
        60 56 37
        56 93 4
        `,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
