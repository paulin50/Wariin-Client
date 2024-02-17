import FormatNumber from "../Converter/Convert";
import { Button } from "bootstrap";
import * as React from "react";
import { Col, Modal, Row } from "reactstrap";
import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr');

export class PrintModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  canvasEl;

  componentDidMount() {
    const ctx = this.canvasEl?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(95, 50, 40, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "rgb(200, 0, 0)";
      ctx.fillRect(85, 40, 20, 20);
      ctx.save();
    }
  }

  handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

  setRef = (ref) => (this.canvasEl = ref);

  render() {
    const { text } = this.props;
    const { showModal } = this.props;
    const { toggleModal } = this.props;
    const { data } = this.props;
    const { total } = this.props;
    const { client } = this.props;

    return (
      <Modal className="modal-dialog-centered"
        isOpen={showModal}
        toggle={toggleModal}
        style={{borderRadius: '0px'}}
      >
        <style type="text/css" media="print">
          {"\ @page { size: landscape; }\ "}
        </style>
        {/* <div className="flash" /> */}
        <span style={{background: '#fff', borderBottom: "2px solid #ccc", borderBottomStyle: 'dashed', fontSize: '16px', color: '#000', fontWeight: '700', padding: '15px 15px 0 15px'}}>Reçu de paiement</span>
        <div style={{background: '#fff', padding: '5px'}}>
          <div style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 10px 15px'}}>
            <span style={{fontSize: '14px', color: '#000'}}>DATE</span>
            <span style={{fontSize: '14px', color: '#C0C0C0'}}>{moment(new Date()).format("DD/MM/YYYY HH:mm")}</span>
          </div>
          <div style={{background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 15px'}}>
            <span style={{fontSize: '14px', color: '#000'}}>CLIENT</span>
            <span style={{fontSize: '14px', }}>{client}</span>
          </div>
        </div>
        <table className="testClass">
          <thead>
            {/* <tr>
              <th className="column1">Reçu de paiement</th>
              <th className="text-right">20/02/2023</th>
            </tr> */}
            <tr style={{border: "1px solid #ccc", fontWeight: '600', fontSize: '14px', background: "#f5f5f5"}}>
              <td>
                <span className=" ml-2 ">Qt.</span>
                <span className=" ml-3">Intitulé article</span>
              </td>
              <td className="text-right">
                <span >Prix</span>
              </td>
            </tr>
          </thead>
          <tbody>
            {
              data?.map((items, index) => (
                <tr style={{border: "1px solid #ccc", fontSize: '14px',}}>
                  <td>
                    <span className=" ml-3">{items.quantity}{" "}</span>
                    <span className=" ml-3">{items.intituleArticle}</span>
                  </td>
                  <td className="text-right">{FormatNumber(items.prix)} CFA</td>
                </tr>
              ))
            }
            <tr style={{borderTop: "1px solid #ccc", fontSize: '14px', fontWeight: "700"}}>
              <td></td>
              <td className="text-right">{" ."}</td>
            </tr>
          </tbody>
          <tr style={{borderTop: "1px solid #ccc", fontSize: '14px', fontWeight: "700"}}>
            <td>Total</td>
            <td className="text-right">{FormatNumber(total)} CFA</td>
          </tr>
          <tr style={{borderTop: "1px solid #ccc", fontWeight: "700", margin: '15px'}}>
            <td>
              <img
                alt="..."
                src={require("./code-barres.jpg")}
                width={"150px"}
                height={"40px"}
                style={{margin: '25px 0 0 0'}}
              />
            </td>
          </tr>
        </table>
        <div style={{background: '#fff', display: 'flex', justifyContent: 'space-around', padding: '15px'}}>
          <button
            style={{ background: '#EAEAEA', borderRadius: "0px", padding: "2px 25px", boxShadow: 'none', color: "#000", border: '0',}}
            onClick={() => toggleModal()}
          >
            Annuler
          </button>
          <button
            style={{ background: '#32D689', borderRadius: "0px", padding: "2px 20px", boxShadow: 'none', color: "#fff", border: '0',}}
            onClick={() => {}}
          >
            Imprimer
          </button>
        </div>
      </Modal>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <PrintModal ref={ref} text={props.text} />;
});
