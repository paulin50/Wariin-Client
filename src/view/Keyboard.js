import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import Keyboard from "react-simple-keyboard";

// Instead of the default import, you can also use this:
// import { KeyboardReact as Keyboard } from "react-simple-keyboard";

import "react-simple-keyboard/build/css/index.css";
// import "./styles.css";

function Clavier(props) {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("numbers");
  const keyboard = useRef();

  const onChange = input => {
    setInput(input);
    console.log("Input changed", input);
  };

  const onChangeInput = event => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  return (
    <div className="App">
      <input
        value={props.input}
        className="input_clavier_"
        placeholder={"Réglé"}
        onChange={props.onChangeInput}
      />
      <Keyboard
        keyboardRef={props.keyboardRef}
        layoutName="ip"
        layout={{
          ip: ["1 2 3", "4 5 6", "7 8 9", "0 {backspace}"]
        }}
        display={{
          "{numbers}": "123",
          "{ent}": "return",
          "{backspace}": "⌫",
        }}
        onChange={props.onChange}
        // onKeyPress={onKeyPress}
      />
    </div>
  );
}
export default Clavier;
// const rootElement = document.getElementById("root");
// ReactDOM.render(<Clavier />, rootElement);
