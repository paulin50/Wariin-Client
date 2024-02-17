import React, { Component } from "react";

class Tabs extends Component {
  state = {
    selected: this.props.selected || 0
  };

  handleChange(index) {
    this.setState({ selected: index });
  }

  render() {
    return (
      <>
        <ul id="ul-tab-2">
          {this.props.children.map((elem, index) => {
            let style = index === this.state.selected ? "selected" : "";
            return (
              <li
                key={index}
                id="li-tab-2"
                className={style}
                onClick={() => this.handleChange(index)}
              >
                {elem.props.title}
              </li>
            );
          })}
        </ul>
        <div className="tab-2">{this.props.children[this.state.selected]}</div>
      </>
    );
  }
}

export default Tabs;
