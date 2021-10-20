// TODO: implement the a star algorithm
export function astar(grid, start, end) {
  // use an open set for the algorithm
  const open_set = [];

  // add all current options to open set
  const x = getAdjacentNodes(grid, start);

  console.log("Adjacent to start - (", start.row, ",", start.col, ") are: \n");

  for (let i = 0; i < x.length; ++i) {
    console.log(x[i]);
  }
}

function calculateDistance(start, end) {
  // use manhattan formula to calculate the distance between two nodes
  return Math.abs(start.row - end.row) + Math.abs(start.col - start.col);
}

function getAdjacentNodes(grid, node) {
  const rows = grid.length;
  const cols = grid[0].length;

  const nodes = [];

  // check lower horizontal spots
  if (node.row + 1 < rows) {
    if (node.col + 1 < cols) {
      nodes.push({ row: node.row + 1, col: node.col + 1 });
    }
    if (node.col - 1 >= 0) {
      nodes.push({ row: node.row + 1, col: node.col - 1 });
    }
    nodes.push({ row: node.row + 1, col: node.col });
  }

  // check upper spots
  if (node.row - 1 >= 0) {
    if (node.col + 1 < cols) {
      nodes.push({ row: node.row - 1, col: node.col + 1 });
    }
    if (node.col - 1 >= 0) {
      nodes.push({ row: node.row - 1, col: node.col - 1 });
    }
    nodes.push({ row: node.row - 1, col: node.col });
  }

  // check middle neighbors
  if (node.col - 1 > 0) {
    nodes.push({ row: node.row, col: node.col - 1 });
  }

  if (node.col + 1 < cols) {
    nodes.push({ row: node.row, col: node.col + 1 });
  }

  return nodes;
}
