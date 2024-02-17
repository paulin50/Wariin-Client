import React, { Component } from 'react';

class TableVente extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      venteData: [
        { entry: 1000, exit: 0, label: 'Vente de produits 1' },
        { entry: 2000, exit: 0, label: 'Vente de produits 2' },
        { entry: 1500, exit: 0, label: 'Vente de produits 3' },
        { entry: 500, exit: 0, label: 'Vente de produits 4' }
      ]
    };
  }
  
  render() {
    return (
      <table className="vente-table">
        <thead>
          <tr>
            <th>Entrée</th>
            <th>Libellé</th>
          </tr>
        </thead>
        <tbody>
          {this.state.venteData.map((data, index) => (
            <tr key={index}>
              <td>{data.entry.toFixed(2)}</td>
              <td>{data.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default TableVente;
