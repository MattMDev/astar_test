import React, { Component } from "react";
import "../css/grid.css";
import Node from "./Node";

export default class MyGrid extends Component {
  constructor() {
    super();

    this.state = {
      grid: [],
    };
  }

  componentDidMount() {
    // On first render, create the grid
    const grid = this.createGrid();
    this.setState({ grid });
  }

  createGrid() {
    const grid = [];
    for (let row = 0; row < 15; row++) {
      // create row
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        // append nodes to row
        // TODO: push a 'grid square' component instead of a number
        const currentNode = { col, row };
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }

    return grid;
  }

  render() {
    return (
      <div className="grid-container">
        {this.state.grid.map((row, rowId) => {
          return (
            <div key={rowId}>
              {row.map((node, nodeId) => (
                <Node key={nodeId} />
              ))}
            </div>
          );
        })}
        <div className="grid-item">1</div>
      </div>
    );
  }
}
