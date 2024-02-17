import './index.css';
import { useContext, useEffect, useState } from 'react';
// node.js library that concatenates classes (strings)
import classnames from 'classnames';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
// reactstrap components
import {
  Button as ButtonRS,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  Media,
} from 'reactstrap';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from 'variables/charts.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Header from 'components/Headers/Header.js';
import TableComponent from './components/Table.js';
import NavBar from 'components/Headers/NavBar.js';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

const Index = props => {
  const { currentUser, famille, article, vente } = useContext(AuthContext);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState('data1');
  const [categorie, setCategorie] = useState('');
  const [filteredArticle, setFilteredArticle] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState({});
  const [loading, setLoading] = useState(false);
  const notifyInfo = message => toast.info(message);
  const notifySuccess = message => toast.success(message);
  const notifyError = message => toast.error(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const handleNo = () => {
    setOpen(false);
  };
  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'famille', id));
      notifySuccess('Supprimer avec succes');
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = id => {
    setSelectedId(id);
  };
  const handlePressArticle = id => {
    setSelectedArticleId(id);
  };
  const handleInput = e => {
    const id = e.target.id;
    const value = e.target.value;
    setSelectedArticle({ ...selectedArticle, [id]: value });
  };
  const HandleAdd = async e => {
    if (
      selectedArticle.codeArticle?.trim() &&
      selectedArticle.intituleArticle?.trim() &&
      selectedArticle.prix?.trim()
    ) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'vente'), {
          ...selectedArticle,
          timeStamp: moment(new Date()).format('LLL'),
        }).then(() => {
          notifySuccess('Ajouter avec succes');
          setLoading(false);
          setSelectedArticle({});
        });
      } catch (err) {
        console.log('######', err);
        notifyError('Erreur, Réessayer');
        setLoading(false);
      }
    } else {
      notifyInfo('Veuillez remplir tous les champs !');
    }
  };

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    if (categorie) {
      const convertedSearchkey = categorie.replace(/\s/g, '').trim();
      let filterArray = article.filter(item => {
        let regex = RegExp(`${convertedSearchkey}*`, 'i');
        return regex.test(item.intituleFamille);
      });
      setFilteredArticle(filterArray);
    }
    if (categorie == '') {
      console.log('key empty');
    }
  }, [categorie]);

  const normalView = {
    backgroundColor: '#fff',
  };
  const selectedView = {
    backgroundColor: '#EFEFEF',
  };

  const ListCategorie = () => {
    return (
      <>
        <Row className="mt-0">
          <Col className="mb-5 mb-xl-0" md="12">
            <Card className="shadow">
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Famille</th>
                  </tr>
                </thead>
                <tbody>
                  {famille.map((item, index) => (
                    <tr>
                      <td
                        style={
                          selectedId === item.id ? selectedView : normalView
                        }
                        onClick={() => {
                          handlePress(item.id);
                          console.log(item.id);
                          setCategorie(item.intituleFamille);
                        }}
                      >
                        {item.intituleFamille}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const DetailsCategorie = () => {
    return (
      <>
        <Row className="mt-0">
          <Col className="mb-5 mb-xl-0" md="12">
            <Card className="shadow">
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" />
                    <th scope="col">Libellé</th>
                    <th scope="col">Famille</th>
                    <th scope="col">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticle.map((item, index) => (
                    <tr
                      style={
                        selectedArticleId === item.id
                          ? selectedView
                          : normalView
                      }
                      onClick={() => {
                        handlePressArticle(item.id);
                        setSelectedArticle(item);
                      }}
                    >
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className=""
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              sizes="90px"
                              style={{ borderRadius: '8px' }}
                              height={'60px'}
                              width={'80px'}
                              src={item.img}
                            />
                          </a>
                        </Media>
                      </th>
                      <td>{item.intituleArticle}</td>
                      <td>{item.intituleFamille}</td>
                      <td>{item.prix} CFA</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const Formulaire = () => {
    return (
      <>
        <Col>
          <Form>
            <h6 className="heading-small text-muted mb-4">Details articles</h6>
            <div className="pl-lg-4">
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Code article
                    </label>
                    <Input
                      className="form-control-alternative"
                      disabled
                      value={selectedArticle.codeArticle}
                      id="codeArticle"
                      placeholder=""
                      type="text"
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-email">
                      Intitulé article
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="intituleArticle"
                      disabled={loading}
                      value={selectedArticle.intituleArticle}
                      placeholder="Intitulé article"
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
                      htmlFor="input-first-name"
                    >
                      Intitulé famille
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={selectedArticle.intituleFamille}
                      id="intituleFamille"
                      disabled={loading}
                      placeholder="Intitulé famille"
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
                      Prix
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={selectedArticle.prix}
                      id="prix"
                      disabled={loading}
                      placeholder="Prix en FCFA"
                      type="number"
                      onChange={handleInput}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="9">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-first-name"
                    >
                      Client
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={selectedArticle.client}
                      id="client"
                      disabled={loading}
                      placeholder="Le client"
                      type="text"
                      onChange={handleInput}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <hr className="my-4" />
            {/* Address */}
            <h6 className="heading-small text-muted mb-4">Autres</h6>
            <div className="pl-lg-3">
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-address"
                    >
                      Image
                    </label>
                    <Col>
                      <div
                        style={{
                          height: '100px',
                          width: '100%',
                          borderRadius: '8px',
                        }}
                      >
                        <img
                          alt="..."
                          // sizes="90px"
                          style={{ borderRadius: '8px' }}
                          height={'100%'}
                          width={'30%'}
                          src={selectedArticle?.img}
                        />
                      </div>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="pl-lg-3">
              <FormGroup>
                <label>Description</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ajouter une description"
                  id="description"
                  disabled={loading}
                  value={selectedArticle.description}
                  rows="4"
                  type="textarea"
                  onChange={handleInput}
                />
              </FormGroup>
            </div>
          </Form>
          <ButtonRS
            block
            className="mb-0"
            color="success"
            type="button"
            onClick={HandleAdd}
            style={{
              background: '#2DCE89',
              color: '#fff',
              borderColor: '#2DCE89',
            }}
          >
            {loading ? 'En cours de validation...' : 'Valider la vente'}
          </ButtonRS>
        </Col>
      </>
    );
  };

  const TableVente = () => {
    return (
      <>
        <Row className="mt-0">
          <Col className="mb-5 mb-xl-0" md="12">
            <Card className="shadow">
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" />
                    <th scope="col">Intitulé article</th>
                    <th scope="col">Intitulé famille</th>
                    <th scope="col">Client</th>
                    <th scope="col">Prix</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vente.map((item, index) => (
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className=""
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              sizes="90px"
                              style={{ borderRadius: '8px' }}
                              height={'60px'}
                              width={'80px'}
                              src={item.img}
                            />
                          </a>
                        </Media>
                      </th>
                      <td>{item.intituleArticle}</td>
                      <td>{item.intituleFamille}</td>
                      <td>{item.client}</td>
                      <td>{item.prix} CFA</td>
                      <td>{item.timeStamp}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data('data' + index);
  };
  return (
    <>
      <NavBar />
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
      <Dialog
        open={open}
        keepMounted
        onClose={handleNo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Suppression'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {'Voullez-vous supprimer cet utilisateur ?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // setYes(false)
              setOpen(false);
            }}
          >
            Non
          </Button>
          <Button
            onClick={() => {
              // setYes(true)
              handleDelete(deleteId);
              setOpen(false);
            }}
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
      {/* Page content */}
      <Container className="mt--9" fluid>
        <Row>
          <Col className="" md="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Famille d'articles</h3>
              </CardHeader>
              <CardBody
                className="custom-scrollbars__content"
                style={{
                  height: '250px',
                }}
              >
                <ListCategorie />
              </CardBody>
            </Card>
          </Col>
          <Col className="" md="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Details familles d'articles</h3>
              </CardHeader>
              <CardBody
                className=""
                style={{ overflow: 'scroll', height: '250px' }}
              >
                <DetailsCategorie />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="mb-5 mb-xl-0 mt-3" md="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Liste des ventes</h3>
              </CardHeader>
              <CardBody
                className=""
                style={{ overflow: 'scroll', height: '250px' }}
              >
                <Formulaire />
              </CardBody>
            </Card>
          </Col>
          <Col className="mt-3" md="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Liste des ventes</h3>
              </CardHeader>
              <CardBody
                className=""
                style={{ overflow: 'scroll', height: '250px' }}
              >
                <TableVente />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
