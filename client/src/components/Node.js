//import React, { useEffect, useState } from "react";
import React from "react";
import "../css/node.css";

export default function Node(props) {
  // get node state from props, and select a class name to adjust the css styling accordingly
  // states:
  // 0 - start node
  // 1 - end node
  // 2 - wall node
  const extraClassName =
    props.nodeState === 0
      ? "node-start"
      : props.nodeState === 1
      ? "node-finish"
      : props.nodeState === 2
      ? "node-wall"
      : "";

  return (
    <div
      id={`node-${props.row}-${props.col}`}
      className={`node ${extraClassName}`}
      // TODO: add triggers - mouse down / enter / up
    ></div>
  );
}
