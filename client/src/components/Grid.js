import React, { Component } from "react";
import "../css/grid.css";
import Node from "./Node";

const maxRows = 6;
const maxCols = 11;
// distances between nodes, straight - 10, diagonal - 14
const straightDistance = 10;
const diagonalDistance = 14;

export default class MyGrid extends Component {
  constructor() {
    super();

    // set state variables
    this.state = {
      grid: [],
      startPos: null,
      finishPos: null,
    };

    // Bind functions
    this.adjustNode = this.adjustNode.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.performAlgorithm = this.performAlgorithm.bind(this);
    this.astar = this.astar.bind(this);
    this.reconstructPath = this.reconstructPath.bind(this);
  }

  componentDidMount() {
    // On first render, create the grid
    //const grid = this.createGrid();
    const grid = this.createTemplateGrid();

    this.setState({ grid });

    // set event for space press
    document.addEventListener("keydown", this.performAlgorithm, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.performAlgorithm, false);
  }

  createGrid() {
    const grid = [];
    for (let row = 0; row < maxRows; row++) {
      // create row
      const currentRow = [];
      for (let col = 0; col < maxCols; col++) {
        // append nodes to row
        const currentNode = {
          col,
          row,
          isStart: false,
          isFinish: false,
          isWall: false,
          isSelected: false,
          isCurrent: false,
          isPath: false,
        };
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }

    return grid;
  }

  createTemplateGrid() {
    const grid = [];
    for (let row = 0; row < maxRows; row++) {
      // create row
      const currentRow = [];
      for (let col = 0; col < maxCols; col++) {
        // append nodes to row
        const currentNode = {
          col,
          row,
          isStart: false,
          isFinish: false,
          isWall: false,
          isSelected: false,
          isCurrent: false,
          isPath: false,
        };
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }

    // adjusting template grid
    grid[1][3].isWall = true;
    for (let i = 3; i < 8; ++i) {
      grid[2][i].isWall = true;
    }

    grid[4][7].isStart = true;
    grid[1][4].isFinish = true;
    this.setState({
      startPos: { row: 4, col: 7 },
      finishPos: { row: 1, col: 4 },
    });

    return grid;
  }

  adjustNode(row, col) {
    // make local copy of grid
    const grid = this.state.grid;

    // check if starting position exists
    if (!this.state.startPos) {
      grid[row][col].isStart = true;
      // update start position
      this.setState({ startPos: { row, col } });
      // check if finish position exists
    } else if (!this.state.finishPos) {
      grid[row][col].isFinish = true;
      // update finish position
      this.setState({ finishPos: { row, col } });
    } else {
      grid[row][col].isWall = true;
    }

    // update grid
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    this.adjustNode(row, col);
  }

  performAlgorithm() {
    if (this.state.startPos && this.state.finishPos) {
      this.astar(this.state.startPos, this.state.finishPos);
    }
  }

  render() {
    return (
      <div className="grid-container">
        {this.state.grid.map((row, rowId) => {
          return (
            <div key={rowId}>
              {row.map((node, nodeId) => (
                <Node
                  key={nodeId}
                  row={rowId}
                  col={nodeId}
                  isStart={node.isStart}
                  isFinish={node.isFinish}
                  isWall={node.isWall}
                  isSelected={node.isSelected}
                  isCurrent={node.isCurrent}
                  isPath={node.isPath}
                  onMouseDown={this.handleMouseDown}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  astar(startPos, endPos) {
    // TODO: use ID's instead of positions
    // make local copy of grid
    const grid = this.state.grid;

    // create new start and end objects with the g costs and f costs
    let start = {
      id: this.getNodeId(grid, startPos),
      g: 0,
      h: this.calculateDistance(startPos, endPos),
      f: this.calculateDistance(startPos, endPos),
    };
    let end = {
      id: this.getNodeId(grid, endPos),
      g: this.calculateDistance(startPos, endPos),
      h: 0,
      f: this.calculateDistance(startPos, endPos),
    };

    // create two sets, open and closed
    let openSet = [start];
    // use set for closedSet for better efficiency
    let closedSet = new Set();

    // create cameFrom dictionary to log the path
    let cameFrom = {};

    while (openSet.length > 0) {
      // sort openSet by f costs
      openSet.sort((a, b) => {
        if (a.f > b.f) return 1;
        if (a.f < b.f) return -1;

        // f costs are identical, sort by lowest h cost
        if (a.h > b.h) return 1;
        if (a.h < b.h) return -1;

        return 0;
      });

      // pop first element of open set (should have the lowest f cost)
      let current = openSet.shift();
      // add id to closedSet
      closedSet.add(current.id);

      // save current pos (row and col)
      let pos = this.getNodeCoordinates(grid, current.id);

      grid[pos.row][pos.col].isCurrent = true;

      // color closedSet
      this.setState({ grid });

      // check if we found the end
      if (current.id === end.id) {
        // reconstruct the path
        this.reconstructPath(cameFrom, end.id, start.id);
        console.log("We have found the end!");
        return true;
      }

      let neighbors = this.getAdjacentNodes(grid, pos);

      for (let i = 0; i < neighbors.length; ++i) {
        const neighbor = neighbors[i];
        const neighborPos = this.getNodeCoordinates(grid, neighbor.id);
        // check that the node is not a wall or in closed set
        if (
          !grid[neighborPos.row][neighborPos.col].isWall &&
          !closedSet.has(neighbor.id)
        ) {
          // compare g costs
          const g = current.g + this.calculateDistance(pos, neighborPos);

          if (g < neighbor.g || !this.findNode(openSet, neighbor.id)) {
            // set new neighbor g cost to the shorter g cost
            neighbor.g = g;
            // set h cost
            neighbor.h = this.calculateDistance(neighborPos, endPos);
            // set new f cost
            neighbor.f = neighbor.g + neighbor.h;
            // add to cameFrom dictionary
            cameFrom[neighbor.id] = current.id;

            if (!this.findNode(openSet, neighbor.id)) {
              // color closed element
              grid[neighborPos.row][neighborPos.col].isSelected = true;

              // add neighbor to openSet
              openSet.push(neighbor);
            }
          }
        }
      }

      // color neighbors
      this.setState({ grid });
    }

    console.log("We failed to find the end!");
    return false;
  }

  getNodeId(grid, node) {
    const cols = grid[0].length;
    return cols * node.row + node.col;
  }

  getNodeCoordinates(grid, nodeId) {
    const cols = grid[0].length;
    return { row: Math.floor(nodeId / cols), col: nodeId % cols };
  }

  reconstructPath(cameFrom, current, start) {
    let grid = this.state.grid;

    current = cameFrom[current];
    while (current !== start) {
      const pos = this.getNodeCoordinates(grid, current);
      // color current
      grid[pos.row][pos.col].isPath = true;
      this.setState({ grid });
      current = cameFrom[current];
    }
  }

  findNode(set, nodeId) {
    // check if nodes already exist
    for (let j = 0; j < set.length; ++j) {
      if (set[j].id === nodeId) {
        return true;
      }
    }

    return false;
  }

  calculateDistance(start, end) {
    // there are different weights for straight and diagonal nodes (10 and 14 accordingly)
    if (start.col === end.col)
      return Math.abs(end.row - start.row) * straightDistance;

    // calculate diagonal moves (the difference of rows)
    const y = Math.abs(end.row - start.row);

    // calculate straight moves (the difference of cols - amount we moved diagonally)
    const x = Math.abs(end.col - start.col) - y;

    return y * diagonalDistance + x * straightDistance;
  }

  getAdjacentNodes(grid, node) {
    const rows = grid.length;
    const cols = grid[0].length;

    let nodes = [];

    // check lower horizontal spots
    if (node.row + 1 < rows) {
      if (node.col + 1 < cols) {
        nodes.push({
          id: this.getNodeId(grid, { row: node.row + 1, col: node.col + 1 }),
          f: 0,
          h: 0,
          g: 0,
        });
      }
      if (node.col - 1 >= 0) {
        nodes.push({
          id: this.getNodeId(grid, { row: node.row + 1, col: node.col - 1 }),
          f: 0,
          h: 0,
          g: 0,
        });
      }
      nodes.push({
        id: this.getNodeId(grid, { row: node.row + 1, col: node.col }),
        f: 0,
        h: 0,
        g: 0,
      });
    }

    // check upper spots
    if (node.row - 1 >= 0) {
      if (node.col + 1 < cols) {
        nodes.push({
          id: this.getNodeId(grid, { row: node.row - 1, col: node.col + 1 }),
          f: 0,
          h: 0,
          g: 0,
        });
      }
      if (node.col - 1 >= 0) {
        nodes.push({
          id: this.getNodeId(grid, { row: node.row - 1, col: node.col - 1 }),
          f: 0,
          h: 0,
          g: 0,
        });
      }
      nodes.push({
        id: this.getNodeId(grid, { row: node.row - 1, col: node.col }),
        f: 0,
        h: 0,
        g: 0,
      });
    }

    // check middle neighbors
    if (node.col - 1 >= 0) {
      nodes.push({
        id: this.getNodeId(grid, { row: node.row, col: node.col - 1 }),
        f: 0,
        h: 0,
        g: 0,
      });
    }

    if (node.col + 1 < cols) {
      nodes.push({
        id: this.getNodeId(grid, { row: node.row, col: node.col + 1 }),
        f: 0,
        h: 0,
        g: 0,
      });
    }

    return nodes;
  }
}
