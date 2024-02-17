import React from "react";

export default function Panel(props) {
  return <div style={{height: '100%', width: '100%',}}>{props.children}</div>;
}
