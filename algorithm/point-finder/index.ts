enum Direction {
  north = "NORTH",
  east = "EAST",
  south = "SOUTH",
  west = "WEST",
}

const directionList = [
  Direction.north,
  Direction.east,
  Direction.south,
  Direction.west,
];

export function calcCenter(
  quantity: number = 20,
  radius: number = 1,
  center: [number, number] = [0, 0]
) {
  const generationList: Point[][] = [];
  const root = new Point(radius, center);
  generationList.push([root]);
  let currentCount = 1;
  console.log("into calc");
  while (currentCount <= quantity) {
    const nextGeneration: Point[] = [];
    const latestGeneration = generationList.at(-1);
    console.log("latest generation");
    console.dir(latestGeneration);
    latestGeneration?.forEach((point) => {
      const newGenerations = point.generate();
      console.log("newGenerations");
      console.log(newGenerations);
      nextGeneration.push(...newGenerations);
    });
    currentCount += nextGeneration.length;
    console.log(`currentCount is ${currentCount}`);
    if (nextGeneration.length) generationList.push(nextGeneration);
    console.log("generationList");
    console.log(generationList);
    nextGeneration.length = 0;
  }
  const coordinateList = generationList.flat().map((point) => point.coordinate);
  console.dir(coordinateList);
  return coordinateList;
}

class Point {
  coordinate: [number, number];

  rad: number;

  [Direction.north]: Point | null = null;
  [Direction.east]: Point | null = null;
  [Direction.south]: Point | null = null;
  [Direction.west]: Point | null = null;

  constructor(
    rad: number,
    parent: Point | [number, number],
    direction?: Direction
  ) {
    this.rad = rad;
    if (direction && parent instanceof Point) {
      this[direction] = parent;
      this.coordinate = addCoordinate(parent.coordinate, direction, rad);
    } else {
      this.coordinate = parent as [number, number];
    }
  }

  public generate() {
    const nextGeneration: Point[] = [];
    for (const direction of directionList) {
      if (!this[direction]) {
        this[direction] = new Point(this.rad, this, reverse(direction));
        nextGeneration.push(this[direction]!);
      }
    }
    return nextGeneration;
  }
}

function addCoordinate(
  coordinate: [number, number],
  direction: Direction,
  rad: number
): [number, number] {
  return {
    [Direction.north]: [coordinate[0], coordinate[1] + rad],
    [Direction.east]: [coordinate[0] + rad, coordinate[1]],
    [Direction.south]: [coordinate[0], coordinate[1] - rad],
    [Direction.west]: [coordinate[0] - rad, coordinate[1]],
  }[direction] as [number, number];
}

function reverse(direction: Direction): Direction {
  return {
    [Direction.north]: Direction.south,
    [Direction.east]: Direction.west,
    [Direction.south]: Direction.north,
    [Direction.west]: Direction.east,
  }[direction];
}

calcCenter();
