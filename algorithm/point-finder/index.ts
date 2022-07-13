enum Direction {
  north = "NORTH",
  east = "EAST",
  south = "SOUTH",
  west = "WEST",
}

const CWOrderList = [
  Direction.north,
  Direction.east,
  Direction.south,
  Direction.west,
];

/**
 * 根据给定的参数，螺旋式的计算点集
 * @param quantity 需要的点的数量
 * @param radius 点与点之间的距离
 * @param center 起始点
 */
export function spiralPointCalculator(
  quantity: number = 20,
  radius: number = 1,
  center: [number, number] = [0, 0]
) {
  const resultPointList: [number, number][] = [center];
  // how many points on current rotate leaf
  let currentLeafLength = 1;
  while(resultPointList.length < quantity){
    for (let i = 0; i < 4; i++) {
      const direction = CWOrderList[i];
      for (let j = 0; j < currentLeafLength; j++) {
        if (resultPointList.length >= quantity) {
          return resultPointList;
        }
        const newPoint = addCoordinate(
            resultPointList.at(-1)!,
            direction,
            radius
        );
        resultPointList.push(newPoint);
      }
      // extend leaf on every second turn
      if (i % 2 === 1) {
        currentLeafLength += 1;
      }
    }

  }
  return resultPointList
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

const line = {
  type: "LineString",
  coordinates: spiralPointCalculator(40,2,[1,1]),
};

console.dir(line);
