import FormatNumber from "../Converter/Convert";
import { Button } from "bootstrap";
import * as React from "react";
import { Col, Modal, Row } from "reactstrap";
import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr');

export class PrintComponent extends React.PureComponent {
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
    const { entreprise } = this.props;
    const { montantRendu } = this.props;
    const { montantRegle } = this.props;

    return (
      <div style={{width: '90mm', height: '', background: '#fff', padding: "0px 15px", fontSize: '10px',}}  className="police_ticket_caisse">
        <style type="text/css" media="print">
          {"\ @page { size: 60mm 90mm; }\ "}
        </style>
        <div className="flash" />
        <div style={{padding: '10px 0 5px 0', textAlign: 'center',}}>
          <img
            alt="..."
            src={entreprise.img}
            width={"150px"}
            height={"50px"}
            style={{borderRadius: "0px", margin: '0 0 5px 0', border: '1px solid #f5f5f5', }}
          />
          <br/>
          <span className=" ">{entreprise.raisonSociale}</span>
          <br/>
          <span className=" ">{entreprise.objetsSocials}</span>
          <br/>
          <span className=" ">{entreprise.adresse}, {entreprise.phoneNumber}</span>
        </div>
        <div style={{background: '#fff', padding: '5px 0'}}>
          {/* <div style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0'}}>
            <span style={{fontSize: '14px', color: '#000'}}>CLIENT</span>
            <span style={{fontSize: '14px', }}>{client}</span>
          </div> */}
          <div style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0'}}>
            <span style={{}}>{moment(new Date()).format("DD/MM/YYYY HH:mm")}</span>
          </div>
        </div>
        <table className="testClass">
          <thead>
            {/* <tr>
              <th className="column1">Reçu de paiement</th>
              <th className="text-right">20/02/2023</th>
            </tr> */}
            <tr 
              style={{
                borderTop: "1px solid #000", 
                borderTopStyle: 'dashed', 
                fontWeight: '600', 
                // fontSize: '14px', 
                background: "#fff"
                }}
              >
              <td>
                <span className=" ml-2 ">Qt.</span>
                <span className=" ml-3">Intitulé</span>
              </td>
              <td className="text-right">
                <span className=" ml-3">Prix unitaire</span>
              </td>
              <td className="text-right">
                <span className=" ml-3">Prix</span>
              </td>
            </tr>
          </thead>
          <tbody
            style={{
              borderTop: "1px solid #000", 
              borderTopStyle: 'dashed',  
              // fontSize: '14px',
            }}
          >
            {
              data?.map((items, index) => (
                <tr style={{
                  // borderBottom: "1px solid #000", 
                  // borderBottomStyle: 'dashed',  fontSize: '14px',
                }}>
                  <td>
                    <span className=" ml-3">{items.quantity}{" "}</span>
                    <span className=" ml-3">{items.intituleArticle}</span>
                  </td>
                  <td className="text-right">{FormatNumber(items.prix)}</td>
                  <td className="text-right">{FormatNumber(items.prix*items.quantity)} F</td>
                </tr>
              ))
            }
          </tbody>
          <tr 
            style={{
              borderBottom: "1px solid #000", 
              borderTop: "1px solid #000", 
              borderBottomStyle: 'dashed', 
              borderTopStyle: 'dashed', 
              fontWeight: '600', 
              // fontSize: '14px', 
              background: "#fff"
            }}
          >
            <td>Total</td>
            <td className="text-right"></td>
            <td className="text-right">{FormatNumber(total)} CFA</td>
          </tr>
          <tr 
            style={{
              fontWeight: '600', 
              // fontSize: '14px', 
              background: "#fff"
            }}
          >
            <td>Montant donné</td>
            <td className="text-right"></td>
            <td className="text-right">{FormatNumber(montantRegle)} CFA</td>
          </tr>
          <tr 
            style={{
              fontWeight: '600', 
              // fontSize: '14px', 
              background: "#fff"
            }}
          >
            <td>Montant rendu</td>
            <td className="text-right"></td>
            <td className="text-right">{FormatNumber(montantRendu)} CFA</td>
          </tr>
          <tr style={{ fontWeight: "500", margin: '0' ,}}>
            <td>Sur place</td>
            <td className="text-right"></td>
            <td className="text-right"></td>
          </tr>
          <tr style={{ fontWeight: "700", margin: '0' ,}}>
            <td>{client}</td>
            <td className="text-right"></td>
            <td className="text-right"></td>
          </tr>
          <tr style={{ fontWeight: "700", margin: '0' ,}}>
            <td>Ref.</td>
            <td className="text-right"></td>
            <td className="text-right">
              {/* <span style={{}}>{new Date().toISOString()}</span> */}
              <span style={{}}>{""+moment(new Date()).format()}</span>   
            </td>
          </tr>
        </table>
        <div style={{padding: '15px 0 0 0', textAlign: 'center', }}>
          <span className=" ">Merci de votre visite</span>
          <br/>
          <span className=" "> et à bientôt</span>
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <PrintComponent ref={ref} text={props.text} />;
});
