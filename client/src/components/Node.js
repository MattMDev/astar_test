//import React, { useEffect, useState } from "react";
import React from "react";
import "../css/node.css";

export default function Node(props) {
  // get node state from props, and select a class name to adjust the css styling accordingly
  // props we should get:
  // isStart
  // isFinish
  // isWall
  // isSelected
  // isCurrent
  // isPath
  // row
  // col
  // OnMouseDown (callback function)
  // OnMouseEnter (callback function)
  // OnMouseUp (callback function)
  const extraClassName = props.isPath
    ? "node-shortest-path"
    : props.isStart
    ? "node-start"
    : props.isFinish
    ? "node-finish"
    : props.isWall
    ? "node-wall"
    : props.isCurrent
    ? "node-current"
    : props.isSelected
    ? "node-selected"
    : "";

  return (
    <div
      id={`node-${props.row}-${props.col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => props.onMouseDown(props.row, props.col)}
      //   onMouseEnter={() =>
      //     this.props.OnMouseEnter(this.props.row, this.props.col)
      //   }
      //   onMouseUp={() => this.props.OnMouseUp()}
    ></div>
  );
}
