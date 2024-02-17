import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from 'reactstrap';
// core components
import UserHeader from '../../Views/Headers/UserHeader.js';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Profile = () => {
  const { currentUser, user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onChange, setOnChange] = useState(false);
  const [file, setFile] = useState('');
  const [url, setUrl] = useState('');
  const [perc, setPerc] = useState(null);
  let image = '';
  // console.log(currentUser);

  const notifyAdd = message => toast.success(message);
  const notify = message => toast.error(message);
  const notifyInfo = message => toast.info(message);

  const handleInput = e => {
    setOnChange(true);
    const id = e.target.id;
    const value = e.target.value;
    setUserInfo({ ...userInfo, [id]: value });
    console.log(userInfo);
  };

  const uploadImage = async () => {
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
        // console.log(data);
        uploadData(image);
      });
    } else {
      uploadData(image);
    }
  };

  const HandleAdd = async e => {
    if (userInfo !== {}) {
      setError('');
      setLoading(true);
      uploadImage();
    } else {
      notifyInfo('Veuillez remplir tous les champs !');
    }
  };

  async function uploadData(img) {
    try {
      const ref = doc(db, 'users', currentUser.uid);
      await updateDoc(ref, {
        email: userInfo.email,
        nom: userInfo.nom,
        password: userInfo.password,
        prenoms: userInfo.prenoms,
        updateTime: Timestamp.fromDate(new Date()),
        username: userInfo.username,
        phoneNumber: userInfo.phoneNumber,
        adresse: userInfo.adresse,
        photoURL: img ? img : userInfo?.photoURL,
      }).then(() => {
        notifyAdd('Ajouter avec succes');
        setLoading(false);
        setUserInfo({});
      });
    } catch (err) {
      console.log('######', err);
      setLoading(false);
      notify('Erreur, Réessayer');
    }
  }

  // const handleUpdate = async () =>{
  //   setLoading(true)
  //   try {
  //     const ref = doc(db, "users", currentUser.uid);
  //     await updateDoc(ref, {
  //       email: userInfo.email,
  //       nom: userInfo.nom,
  //       password: userInfo.password,
  //       prenoms: userInfo.prenoms,
  //       updateTime: Timestamp.fromDate(new Date()),
  //       username: userInfo.username,
  //       phoneNumber: userInfo.phoneNumber,
  //       adresse: userInfo.adresse,
  //     }).then(() => {
  //       localStorage.setItem("user", JSON.stringify(userInfo))
  //       notifyAdd("Modifier avec succès")
  //       setLoading(false)
  //     })
  //   } catch (error) {
  //     notify('Erreur')
  //   }
  // }

  return (
    <>
      <UserHeader />
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
      {/* Page content */}
      <Container className="mt--9" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  {/* <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/user.jpg")}
                      />
                    </a>
                  </div> */}
                  <div className="card-profile-image">
                    <label id="label-img" htmlFor="file">
                      <img
                        alt="..."
                        width={150}
                        height={150}
                        className="rounded-circle shadow"
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : userInfo?.photoURL
                            ? userInfo?.photoURL
                            : require('../../assets/img/theme/user.jpg')
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
                </Col>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </Row>
                <div className="text-center mt-6">
                  <h3>
                    {user.nom} {user.prenoms}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />@{user.username}
                  </div>
                  <div className="h5 mt-4 text-success">
                    <i className="ni business_briefcase-24 mr-2" />
                    {user.fonction}
                  </div>
                  <div className="h5 mt-4 text-orange">
                    <i className="ni business_briefcase-24 mr-2" />
                    Caisse : {user.caisse}
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    {user.email}
                  </div>
                  <hr className="my-4" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1 pb-5" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mon compte</h3>
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
                            Nom d'utilisateur
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="username"
                            value={userInfo.username}
                            placeholder="Nom d'utilisateur"
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
                            Email
                          </label>
                          <Input
                            disabled
                            className="form-control-alternative"
                            id="email"
                            value={userInfo.email}
                            placeholder="staiz@example.com"
                            type="email"
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
                            Nom
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="nom"
                            value={userInfo.nom}
                            placeholder="Nom"
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
                            Prénoms
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="prenoms"
                            value={userInfo.prenoms}
                            placeholder="Prénoms"
                            type="text"
                            onChange={handleInput}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
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
                            defaultValue=""
                            id="adresse"
                            value={userInfo.adresse}
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
                            value={userInfo.phoneNumber}
                            placeholder=""
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
                            Mot de passe
                          </label>
                          <Input
                            className="form-control-alternative"
                            placeholder="********"
                            id="password"
                            value={userInfo.password}
                            type="password"
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
                  block
                  disabled={!onChange}
                  className="mb-5 mr-5 ml-5"
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
                  {loading ? 'Chargement...' : 'Modifier profile'}
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
