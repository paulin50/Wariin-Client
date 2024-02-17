import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  Row,
  Col
} from "reactstrap";
import { MoonLoader } from "react-spinners";

const Modalupdate = (props) => {
  const [defaultModal, setDefaultModal] = useState(false);

//   setDefaultModal(props.toggleModal)

  const toggleModal = () => {
    setDefaultModal(!defaultModal);
  };

  return (
    <>
      <Row>
        <Col md="4">
          {
            props.buttonText ? 
            <Button
              block
              className="mb-0"
              // color="success"
              type="button"
              onClick={toggleModal}
              style={{background: '#2DCE89', color: "#fff", borderColor: '#2DCE89'}}
            >
              {props.buttonText}
            </Button>
            :null
          }
          <Modal
            className="modal-dialog-centered"
            isOpen={props.showModal}
            toggle={props.toggleModal}
          >
            <div className="modal-header" style={{backgroundColor: '#fafafa'}} disabled="true">
                <h3 className="modal-title" id="modal-title-default">
                    {props.modalTitle}
                </h3>
                <Row>
                    {
                        props.loading ?
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '0', alignItems: 'center' }}>
                            <MoonLoader size={20} color={'#2dce89'} loading={props.loading} />
                            <span style={{ padding: '0 0 0 3px', fontSize: '14px', color: '#2dce89', fontWeight: 'bold' }}>Chargement...</span>
                        </div> : null
                    }
                    {
                        props.error ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h5 style={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>Alerte : {props.error?.length > 20 ? props.error?.substring(0, 20) +'...' : props.error} </h5>
                        </div> : null
                    }
                    <button
                        aria-label="Close"
                        className="close mr-1"
                        data-dismiss="modal"
                        type="button"
                        onClick={props.toggleModal}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </Row>
            </div>
            <div className="modal-body" style={{backgroundColor: '#fafafa'}}>
                {props.children}              
            </div>
            <div className="modal-footer" style={{backgroundColor: '#fafafa'}}>
              <Button color="info" type="button" onClick={props.onClick} disabled={props.loading}
                style={{
                  background: `${props.onChange ? '#2DCE89' : '#E7E7E7'}`, 
                  pointerEvents: `${props.onChange ? 'painted' : 'none'}`,
                  boxShadow: `${props.onChange ? 'none' : 'initial'}`,
                  color: `${props.onChange ? '#fff' : '#B2B2B2'}`, 
                  borderColor: `${props.onChange ? '#2DCE89' : '#E7E7E7'}`
                }}
              >
                Modifier
              </Button>
              <Button
                className="ml-auto text-red"
                color="link"
                data-dismiss="modal"
                type="button"
                onClick={props.toggleModal}
              >
                Fermer
              </Button>
            </div>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default Modalupdate;
