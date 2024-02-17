import React, { Component } from "react";

import Tabs from "./Tabs";
import Panel from "./Panel";

import "./index.css";
import TabCaisse from "./TabCaisse";
import TabUsers from "./TabUsers";
import TabArticle from "./TabArticle";
import TabFamille from "./TabFamille";
import TabCompte from "./TabCompte";

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], userId: 4, array: [5, 1, 3, 4, 6] };
  }

  componentDidMount() {
  }

  render() {
    const { data, array, userId } = this.state;
    return (
      <div className="main-container">
        <Tabs>
          <Panel title="Type de clients">
            {/* <TabArticle data={this.props.data}/> */}
          </Panel>
          {/* <Panel title="Familles">
            <TabFamille data={this.props.data}/>
          </Panel> */}
          <Panel title="Utilisateurs">
            <TabUsers data={this.props.data} 
              // toggleModal={this.props.toggleModal}
            />
          </Panel>
          {/* <Panel title="Caisses">
            <TabCaisse data={this.props.data}/>
          </Panel> */}
          <Panel title="Compte">
            <TabCompte/>
          </Panel>
        </Tabs>
      </div>
    );
  }
}

export default Tab;