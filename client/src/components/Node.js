//import React, { useEffect, useState } from "react";
import React from "react";
import "../css/node.css";

export default function Node(props) {
  // get node state from props, and select a class name to adjust the css styling accordingly
  // props we should get:
  // state
  // row
  // col
  // OnMouseDown (callback function)
  // OnMouseEnter (callback function)
  // OnMouseUp (callback function)
  const extraClassName = props.state;

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
