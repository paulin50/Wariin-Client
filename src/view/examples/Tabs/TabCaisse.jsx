import './index.css'
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/fr'
import Modals from '../../../view/components/Modal';
import { addDoc, collection } from "firebase/firestore"; 
import { db } from "../../../firebaseConfig";
import {
  FormGroup,
  Form,
  Input,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import { toast } from "react-toastify";
import TableCaisse from '../../../view/components/TableCaisse';
moment.locale('fr')

export default function TabCaisse(props) {

  const notifyAdd = (message) => toast.success(message);
  const notify = (message) => toast.error(message);
  const notifyInfo = (message) => toast.info(message);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);

  const handleInput = (e) =>{
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value});
    console.log(data.codeCaisse);
  }

  const HandleAdd = async(e) => {
    console.log(data.codeCaisse);
    e.preventDefault()
    if(
        data.codeCaisse?.trim() && 
        data.intituleCaisse?.trim()
      ) {
      setError("");
      setLoading(true);
      console.log(data);
      try {
        await addDoc(collection(db, 'caisse'), {
          ...data,
          timeStamp: moment(new Date()).format('LLL'),
        }).then(() => {
          notifyAdd("Ajouter avec succes");
          setLoading(false)
          setData({})
        })
      } catch (err) {
        console.log("######",err);
        notify("Erreur, Réessayer");
        setLoading(false);
      }
    }else {
      notifyInfo("Veuillez remplir tous les champs !");
    }
  }

  return (
    <>
      <div style={{
        padding: '18px',
        backgroundColor: 'whitesmoke',
        borderWidth: '1px',
      }}>
        <Modals 
          buttonText={"Ajouter"} 
          modalTitle={"Ajouter caisse"} 
          onClick={HandleAdd}
          loading={loading}
          error={error}
          toggleModal={()=>{}}
        >
          <Form>
            <Row>
              <Col md="12">
                <FormGroup>
                  <InputGroup className="mb-4 input-group-alternative">
                    <Input id='codeCaisse' disabled={loading} placeholder="Code caisse" type="text" onChange={handleInput}/>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <InputGroup className="mb-4 input-group-alternative">
                    <Input id='intituleCaisse' disabled={loading} placeholder="Intitulé du caisse " type="text" onChange={handleInput}/>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Modals>
      </div>
      <div style={{
        height: '560px',
        overflow: 'scroll',
        padding: '18px',
      }} >
        <TableCaisse toggleModal={props.toggleModal} />
      </div>
    </>
  )
}

