import React, { Component } from "react";
import "../css/grid.css";
import Node from "./Node";
import { astar } from "../algorithms/Astar.js";

const maxRows = 9;
const maxCols = 9;

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

    console.log("row - ", row, "\ncol - ", col);

    // update grid
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    this.adjustNode(row, col);
  }

  performAlgorithm() {
    //if (this.state.startPos && this.state.finishPos) {
    if (this.state.startPos) {
      astar(this.state.grid, this.state.startPos, this.state.finishPos);
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
                  onMouseDown={this.handleMouseDown}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}
