import React, { useState } from 'react'
import Modals from '../../../view/components/Modal';
import { addDoc, collection } from "firebase/firestore"; 
import { db, storage } from "../../../firebaseConfig";
import {
  FormGroup,
  Form,
  Input,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import { toast } from "react-toastify";
import TableFamille from '../../../view/components/TableFamille';
import moment from 'moment';
import 'moment/locale/fr'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
moment.locale('fr')

function TabFamille(props) {

  const notifyAdd = (message) => toast.success(message);
  const notify = (message) => toast.error(message);
  const notifyInfo = (message) => toast.info(message);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [perc, setPerc] = useState(null);
  const [file, setFile] = useState("");
  let image = "";

  const handleInput = (e) =>{
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value});
  }

  const uploadImage = async () => {
    let upload = new Promise((resolve, reject) => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setPerc(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default: 
              break;
          }
        }, 
        (error) => {
          console.log(error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            image = downloadURL;
            console.log('url', downloadURL);
            if(downloadURL) resolve();
          });
        }
      );
    })
    upload.then(() => {
      console.log('All done!');
      console.log(data);
      uploadData(image);
    });
  }

  const HandleAdd = async(e) => {
    console.log(data.codeCaisse);
    if(
        data.codeFamille?.trim() && 
        data.intituleFamille?.trim()
      ) {
      setError("");
      setLoading(true);
      console.log(data);
      uploadImage();
    }else {
      notifyInfo("Veuillez remplir tous les champs !");
    }
  }
  async function uploadData (img){
    try {
      await addDoc(collection(db, 'famille'), {
        ...data,
        timeStamp: moment(new Date()).format('LLL'),
        icon: img
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
  }

  return (
    <div>
      <div style={{
        padding: '18px',
        backgroundColor: 'whitesmoke',
        borderWidth: '1px',
      }}>
        <Modals 
          buttonText={"Ajouter"} 
          modalTitle={"Ajouter famille"} 
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
                    <Input id='codeFamille' disabled={loading} placeholder="Code famille" type="text" onChange={handleInput}/>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <InputGroup className="mb-4 input-group-alternative">
                    <Input id='intituleFamille' disabled={loading} placeholder="Intitulé du famille" type="text" onChange={handleInput}/>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div 
                  style={{
                    backgroundColor: '#f5f5f5', 
                    height: '90%', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    width: '80%', 
                    borderStyle: 'dashed', 
                    borderWidth: "2px",
                    borderRadius: '3px',
                    padding: '5px',
                    pointerEvents: 'auto',
                    }}
                  >
                    <label id="label-img" htmlFor="file">
                      Choisir icon: 
                      {/* <DriveFolderUploadOutlinedIcon className="icon" /> */}
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: 'none', pointerEvents: 'visible'}}
                    />
                </div>
              </Col>
              <Col>
                <div style={{height: '100px', width: '100%', borderRadius: '8px'}} >
                  <img
                    alt="..."
                    // sizes="90px"
                    style={{ borderRadius: '8px', background: '#fff'}}
                    height={"90%"}
                    width={"50%"}
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : "https://png.pngtree.com/png-vector/20200522/ourmid/pngtree-contact-us-icons-simple-flat-vector-icons-set-on-white-background-png-image_2211367.jpg"
                    }
                  />
                </div>
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
        <TableFamille toggleModal={props.toggleModal} />
      </div>
    </div>
  )
}

export default TabFamille