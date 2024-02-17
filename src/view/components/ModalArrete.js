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

const ModalArrete = (props) => {
  return (
    <>
      <Row>
        <Col md="12">
          <Modal
            className="modal-dialog-centered"
            isOpen={props.showModal}
            toggle={props.toggleModal}
            style={{maxWidth: '700px', background: "", borderRadius: 0}}
          >
            <div className="modal-header" style={{backgroundColor: '#fafafa', padding: "15px 5px 0 0", height: "40px"}} disabled="true">
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
                        className="close mr-1 mb-0"
                        data-dismiss="modal"
                        type="button"
                        onClick={props.toggleModal}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </Row>
            </div>
            <div className="modal-body" style={{backgroundColor: '#fafafa', padding: "5px 15px"}}>
              {props.children}              
            </div>
            <div className="modal-footer" style={{backgroundColor: '#fafafa'}}>
              <Button color="info" type="button" onClick={props.onClick} disabled={props.loading} 
                style={{background: '#F96131', color: "#fff", borderColor: '#F96131'}}
              >
                Valider
              </Button>
              <Button
                className="ml-auto text-orange"
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

export default ModalArrete;
