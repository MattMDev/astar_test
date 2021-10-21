import React, { Component } from "react";
import "../css/grid.css";
import Node from "./Node";

const maxRows = 9;
const maxCols = 9;
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
  }

  componentDidMount() {
    // On first render, create the grid
    const grid = this.createGrid();
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
        // TODO: push a 'grid square' component instead of a number
        const currentNode = {
          col,
          row,
          isStart: false,
          isFinish: false,
          isWall: false,
          isSelected: false,
          isCurrent: false,
        };
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }

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
                  onMouseDown={this.handleMouseDown}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Helper functions - move to other file if possible
  // TODO: implement the a star algorithm
  astar(start, end) {
    // use an open set for the algorithm
    let openSet = [];
    let closedSet = [start];

    // make local copy of grid for changes
    let grid = this.state.grid;

    // pop closedSet and start looking for neighbors
    let curr = start;

    while (
      typeof curr !== "undefined" &&
      !(curr.row === end.row && curr.col === end.col)
    ) {
      grid[curr.row][curr.col].isCurrent = true;

      // color closedSet
      this.setState({ grid });

      // look for neighbors and add them to the openSet
      const adjacentNodes = this.getAdjacentNodes(this.state.grid, curr);

      for (let i = 0; i < adjacentNodes.length; ++i) {
        let node = adjacentNodes[i];

        // check that the node was not visited already(in the closed list)
        if (this.findNode(closedSet, node) === -1) {
          // check that the node is not a wall
          if (!grid[node.row][node.col].isWall) {
            // check that the node is not in the openSet already
            const index = this.findNode(openSet, node);

            if (index === -1) {
              // calculate g, h, f
              node.g = this.calculateDistance(node, start);
              node.h = this.calculateDistance(node, end);
              node.f = node.g + node.h;

              // color closed element
              grid[node.row][node.col].isSelected = true;

              // append new neighbor to openSet
              openSet.push(node);
            } else {
              // node exists already, update costs
              openSet[index].g = this.calculateDistance(node, start);
              openSet[index].h = this.calculateDistance(node, end);
              openSet[index].f = openSet[index].g + openSet[index].h;
            }
          }
        }
      }

      // color neighbors
      this.setState({ grid });

      // sort open set options by f costs, if f costs are identical sort by h costs
      openSet.sort((a, b) => {
        if (a.f > b.f) return 1;
        if (a.f < b.f) return -1;

        // f costs are identical, sort by lowest h cost
        if (a.h > b.h) return 1;
        if (a.h < b.h) return -1;
        return 0;
      });

      // add current to the closedSet
      closedSet.push(curr);
      // TODO: set curr to be closed.

      // set closest node to be the current node
      curr = openSet.shift();
    }

    // loop was over, either we found stuff or not.
    if (typeof curr !== "undefined") {
      console.log("We found the end!\n");
      return true;
    }
    console.log("We failed to find stuff!\n");
    return false;
  }

  findNode(set, node) {
    // check if nodes already exist
    for (let j = 0; j < set.length; ++j) {
      if (set[j].row === node.row && set[j].col === node.col) {
        return j;
      }
    }

    return -1;
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
        nodes.push({ row: node.row + 1, col: node.col + 1, f: 0, h: 0, g: 0 });
      }
      if (node.col - 1 >= 0) {
        nodes.push({ row: node.row + 1, col: node.col - 1, f: 0, h: 0, g: 0 });
      }
      nodes.push({ row: node.row + 1, col: node.col, f: 0, h: 0, g: 0 });
    }

    // check upper spots
    if (node.row - 1 >= 0) {
      if (node.col + 1 < cols) {
        nodes.push({ row: node.row - 1, col: node.col + 1, f: 0, h: 0, g: 0 });
      }
      if (node.col - 1 >= 0) {
        nodes.push({ row: node.row - 1, col: node.col - 1, f: 0, h: 0, g: 0 });
      }
      nodes.push({ row: node.row - 1, col: node.col, f: 0, h: 0, g: 0 });
    }

    // check middle neighbors
    if (node.col - 1 >= 0) {
      nodes.push({ row: node.row, col: node.col - 1, f: 0, h: 0, g: 0 });
    }

    if (node.col + 1 < cols) {
      nodes.push({ row: node.row, col: node.col + 1, f: 0, h: 0, g: 0 });
    }

    return nodes;
  }
}
