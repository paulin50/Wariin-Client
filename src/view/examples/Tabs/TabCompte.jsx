import './index.css';
import React, { useState, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/fr';
import Modals from '../../../view/components/Modal';
import { setDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebaseConfig';
import {
  FormGroup,
  Form,
  Input,
  InputGroup,
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import { AuthContext } from '../../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
moment.locale('fr');

export default function TabCompte(props) {
  const { currentUser, user, entreprise } = useContext(AuthContext);

  const notifyAdd = message => toast.success(message);
  const notify = message => toast.error(message);
  const notifyInfo = message => toast.info(message);
  const [data, setData] = useState(entreprise);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [onChange, setOnChange] = useState(false);
  const [file, setFile] = useState('');
  const [url, setUrl] = useState('');
  const [perc, setPerc] = useState(null);
  let image = '';

  const handleInput = e => {
    setOnChange(true);
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    console.log(data);
  };

  // const HandleAdd = async(e) => {
  //   e.preventDefault()
  //   if(
  //       data.codeCaisse?.trim() &&
  //       data.intituleCaisse?.trim()
  //     ) {
  //     setError("");
  //     setLoading(true);
  //     console.log(data);
  //     try {
  //       await addDoc(collection(db, 'caisse'), {
  //         ...data,
  //         timeStamp: moment(new Date()).format('LLL'),
  //       }).then(() => {
  //         notifyAdd("Ajouter avec succes");
  //         setLoading(false)
  //         setData({})
  //       })
  //     } catch (err) {
  //       console.log("######",err);
  //       notify("Erreur, Réessayer");
  //       setLoading(false);
  //     }
  //   }else {
  //     notifyInfo("Veuillez remplir tous les champs !");
  //   }
  // }

  const uploadImage = async () => {
    console.log(file);
    if (file) {
      let upload = new Promise((resolve, reject) => {
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setPerc(progress);
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
          error => {
            console.log(error);
            setLoading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              image = downloadURL;
              console.log('url', downloadURL);
              if (downloadURL) resolve();
            });
          }
        );
      });

      upload.then(() => {
        console.log('All done!');
        console.log(data);
        uploadData(image);
      });
    } else {
      uploadData(image);
    }
  };

  const HandleAdd = async e => {
    console.log(data);
    if (data !== {}) {
      setError('');
      setLoading(true);
      uploadImage();
    } else {
      notifyInfo('Veuillez remplir tous les champs !');
    }
  };

  async function uploadData(img) {
    try {
      setDoc(doc(db, 'entreprise', 'YYKpHgT8j9DLMPPabqf3'), {
        raisonSociale: data.raisonSociale,
        objetsSocials: data.objetsSocials,
        statusJuridique: data.statusJuridique,
        capitalSociete: data.capitalSociete,
        pays: data.pays,
        ville: data.ville,
        adresse: data.adresse,
        phoneNumber: data.phoneNumber,
        email: data.email,
        timeStamp: Timestamp.fromDate(new Date()),
        img: img ? img : data.img,
      }).then(() => {
        notifyAdd('Ajouter avec succes');
        setLoading(false);
        setData({});
      });
    } catch (err) {
      console.log('######', err);
      setLoading(false);
      notify('Erreur, Réessayer');
    }
  }

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const ref = doc(db, 'entreprise');
      await setDoc(ref, {
        raisonSociale: data.raisonSociale,
        objetsSocials: data.objetsSocials,
        statusJuridique: data.statusJuridique,
        capitalSociete: data.capitalSociete,
        pays: data.pays,
        ville: data.ville,
        adresse: data.adresse,
        phoneNumber: data.phoneNumber,
        email: data.email,
        timeStamp: Timestamp.fromDate(new Date()),
      }).then(() => {
        localStorage.setItem('user', JSON.stringify(data));
        notifyAdd('Modifier avec succès');
        setLoading(false);
      });
    } catch (error) {
      notify('Erreur');
    }
  };

  return (
    <>
      <div
        style={{
          // padding: '18px',
          // backgroundColor: '#000',
          borderWidth: '1px',
        }}
      >
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Modals
          // buttonText={"Ajouter caisse"}
          modalTitle={'Ajouter caisse'}
          onClick={HandleAdd}
          loading={loading}
          error={error}
          toggleModal={() => {}}
        >
          <Form>
            <Row>
              <Col md="12">
                <FormGroup>
                  <InputGroup className="mb-4 input-group-alternative">
                    <Input
                      id="codeCaisse"
                      disabled={loading}
                      placeholder="Code caisse"
                      type="text"
                      onChange={handleInput}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <InputGroup className="mb-4 input-group-alternative">
                    <Input
                      id="intituleCaisse"
                      disabled={loading}
                      placeholder="Intitulé du caisse "
                      type="text"
                      onChange={handleInput}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Modals>
      </div>
      <div
        style={{
          height: '656.5px',
          overflow: 'scroll',
          background: '#fff',
          padding: '25px 15px 15px 15px',
        }}
      >
        <Row>
          <Col className="order-xl-2 mb-2 mb-xl-0" xl="4">
            <Card className="card-profile ">
              {/* <Row className="justify-content-center">
                <Col className="order-lg-2" lg="1">
                  
                </Col>
              </Row> */}
              <CardBody className="pt-0 pt-md-1">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div className="card-profile-image">
                        <label id="label-img" htmlFor="file">
                          {/* <i className="ni ni-album-2 label-img" htmlFor="file"/> */}
                          <img
                            alt="..."
                            width={150}
                            height={150}
                            className="rounded-circle shadow"
                            src={
                              file
                                ? URL.createObjectURL(file)
                                : data.img
                                ? data.img
                                : require('../../../assets/img/theme/user.jpg')
                            }
                          />
                        </label>
                        <input
                          type="file"
                          id="file"
                          onChange={e => {
                            setFile(e.target.files[0]);
                            setOnChange(true);
                          }}
                          style={{ display: 'none', pointerEvents: 'visible' }}
                        />
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center mt-7">
                  <h3>{entreprise.raisonSociale}</h3>
                  <h3>{entreprise.objetsSocials}</h3>
                  <div className="h5 font-weight-300">
                    {entreprise.statusJuridique}
                  </div>
                  {/* <div className="h5 mt-4 text-success">
                    <i className="ni business_briefcase-24 mr-2" />
                    {FormatNumber(entreprise.capitalSociete)}
                  </div> */}
                  <hr className="my-4" />
                  <h3>{entreprise.phoneNumber}</h3>
                  <div className="h5 font-weight-300">
                    <i className="ni ni-pin-3 text-black mr-2" />
                    {entreprise.ville},{entreprise.pays}
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    {entreprise.email}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1 pb-5" xl="8">
            <Card className=" ">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Compte Entreprise</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    {/* <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Paramètres
                    </Button> */}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Informations
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Raison sociale
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="raisonSociale"
                            value={data.raisonSociale}
                            placeholder="Raison sociale"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Objets socials
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="objetsSocials"
                            value={data.objetsSocials}
                            placeholder="Objets socials"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Status juridique
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="statusJuridique"
                            value={data.statusJuridique}
                            placeholder="Status juridique"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Capital société
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="capitalSociete"
                            value={data.capitalSociete}
                            placeholder="Capital société"
                            type="number"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Pays
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="pays"
                            value={data.pays}
                            placeholder="Pays"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Ville
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="ville"
                            value={data.ville}
                            placeholder="Ville"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">Contacts</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Addresse
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="adresse"
                            value={data.adresse}
                            placeholder="Adresse"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Téléphone
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="phoneNumber"
                            value={data.phoneNumber}
                            placeholder="Tél"
                            type="tel"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Email
                          </label>
                          <Input
                            className="form-control-alternative"
                            placeholder="exemple@gmail.com"
                            id="email"
                            value={data.email}
                            type="email"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
              <Row md="12">
                <Button
                  disabled={!onChange}
                  block
                  className="mb-4 mr-5 ml-5"
                  color="success"
                  type="button"
                  onClick={HandleAdd}
                  style={{
                    background: `${onChange ? '#F96131' : '#E7E7E7'}`,
                    pointerEvents: `${onChange ? 'painted' : 'none'}`,
                    color: `${onChange ? '#fff' : '#B2B2B2'}`,
                    borderColor: `${onChange ? '#F96131' : '#E7E7E7'}`,
                  }}
                >
                  {loading ? 'Chargement...' : 'Valider'}
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
