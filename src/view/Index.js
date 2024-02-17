import './index.css';
import './navbar.scss';
import { useContext, useEffect, useState } from 'react';
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
  InputGroup,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  PaginationLink,
  CardFooter,
  Pagination,
  PaginationItem,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig.js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthContext } from '../context/AuthContext.js';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/fr';
import FormatNumber from '../Converter/Convert.js';
import useWindowDimensions from '../variables/windowSize.js';
import InputModal from '../view/components/InputModal.js';
import Clavier from './Keyboard';
import { useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { PrintModal } from '../Print';
import ModalArrete from '../view/components/ModalArrete.js';
moment.locale('fr');

const Index = props => {
  const { currentUser, famille, article, vente, caisse, user, solde, client } =
    useContext(AuthContext);
  const { height, width } = useWindowDimensions();
  // console.log('heig',height);
  const keyboard = useRef();

  const notify = message => toast.warn(message);
  const notifyAdd = message => toast.success(message);
  const notifyDelete = message => toast.success(message);
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState('data1');
  const [categorie, setCategorie] = useState('');
  const [filteredArticle, setFilteredArticle] = useState([]);
  const [clients, setClients] = useState({});
  const [montant, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedClient, setSelectedClient] = useState('Client divers');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState([]);
  const [selectedCaisse, setSelectedCaisse] = useState(null);
  const [loading, setLoading] = useState(false);
  const notifyInfo = message => toast.info(message);
  const notifySuccess = message => toast.success(message);
  const notifyError = message => toast.error(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [productCounts, setProductCounts] = useState({});
  const [montantArendre, setMontantArendre] = useState(0);
  const [montantRegle, setMontantRegle] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showModalArrete, setShowModalArrete] = useState(false);
  const [state, setState] = useState({
    leftOpen: false,
  });
  const [comment, setComment] = useState('');
  const [soldePhysique, setSoldePhysique] = useState(0);
  const [leftOpen, setLeftOpen] = useState('closed');

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = [];
  // Calculer le nombre de pages
  const totalPages = Math.ceil(items.length / itemsPerPage);
  // Récupérer les éléments à afficher sur la page courante
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  // Gérer le clic sur un lien de pagination
  const handleClick = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const history = useHistory();

  const handleSignout = async () => {
    await signOut(auth);
    history.push('/');
    history.go(1);
    localStorage.setItem('user', null);
    history.push('/login');
  };

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
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const togglePrintModal = () => {
    setShowPrintModal(!showPrintModal);
  };
  const toggleModalArrete = () => {
    setShowModalArrete(!showModalArrete);
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
    setClients({ ...clients, [id]: value });
  };
  const HandleAdd = async e => {
    if (selectedArticle.length < 1) {
      notifyError("Veuillez selectionner un article d'abord");
    }
    // else if(!selectedCaisse) {
    //   notifyInfo("Veuillez selectionner la caisse");
    // }
    else {
      setLoading(true);
      try {
        await addDoc(collection(db, 'vente'), {
          articles: selectedArticle,
          // caisse: selectedCaisse,
          caisse: user.caisse,
          user: user.uid,
          timeStamp: moment(new Date()).format('LLL'),
          // montantArendre: montantArendre,
          montantRegle: montantRegle,
          montant: montant,
          client: selectedClient,
        }).then(async () => {
          try {
            await updateDoc(doc(db, 'solde', 'vHCXXnbA9SUwNd28yr3d'), {
              solde: parseInt(montant + solde),
              timeStamp: moment(new Date()).format('LLL'),
              caisse: user.caisse,
            }).then(() => {
              notifySuccess('Vente éffectuer avec succès');
              setShowPrintModal(true);
              setLoading(false);
              // setSelectedArticle([])
              // setSelectedCaisse(null)
              // setTotal(0)
            });
          } catch (error) {
            console.log(error);
          }
        });
      } catch (err) {
        console.log('######', err);
        notifyError('Erreur, Réessayer');
        setLoading(false);
      }
    }
  };
  const HandleAddClient = async e => {
    console.log(clients);
    e.preventDefault();
    if (clients.nom?.trim() && clients.prenoms?.trim()) {
      setError('');
      setLoading(true);
      console.log(clients);
      try {
        await addDoc(collection(db, 'client'), {
          ...clients,
          displayname: clients?.nom + ' ' + clients?.prenoms,
          timeStamp: moment(new Date()).format('LLL'),
        }).then(async () => {
          notifyAdd('Ajouter avec succes');
          setLoading(false);
          setClients({});
        });
      } catch (err) {
        console.log('######', err);
        notify('Erreur, Réessayer');
        setLoading(false);
      }
    } else {
      notifyInfo('Veuillez remplir tous les champs !');
    }
  };

  const createArticleList = product => {
    const index = selectedArticle.findIndex(p => p.id === product.id);
    if (index === -1) {
      setSelectedArticle([...selectedArticle, { ...product, quantity: 1 }]);
      setTotal(parseInt(product.prix) + montant);
    } else {
      const newProducts = [...selectedArticle];
      newProducts[index].quantity += 1;
      setSelectedArticle(newProducts);
      setTotal(parseInt(product.prix) + montant);
    }
  };

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
    // backgroundColor: "#fff",
    // color: "#000",
    height: '40px',
    margin: '10px 0px',
    width: '100%',
    padding: '3px 0',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const selectedView = {
    backgroundColor: '#F96131',
    color: '#fff',
    height: '40px',
    margin: '10px 0px',
    width: '100%',
    padding: '3px 0',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0.5px 1px 10px #c4c4c4',
  };
  const normalArticleView = {
    height: '95px',
    margin: '3px',
    width: '105px',
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    borderRadius: '5px',
    background: '#60D5B1',
  };
  const selectedArctileView = {
    backgroundColor: '#A2DFAF',
    height: '95px',
    margin: '3px',
    width: '105px',
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    borderRadius: '5px',
  };

  // Styles CSS pour la table
  const tableStyle = {
    // fontFamily: 'Arial, sans-serif',
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: 12,
    color: '#000',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    color: '#333',
    padding: '5px',
    textAlign: 'left',
    border: '2px solid #626262',
  };

  const tdStyle = {
    padding: '2px',
    border: '2px solid #626262',
    textAlign: 'right',
  };
  const soldeStyle = {
    // backgroundColor: '#f2f2f2',
    color: '#333',
    padding: '2px',
    textAlign: 'left',
    fontWeight: '600',
    border: '2px solid #626262',
  };
  const [billet, setBillet] = useState({});
  const billets = [
    { valeur: 10000, id: 'dixmille' },
    { valeur: 5000, id: 'cinqmille' },
    { valeur: 2000, id: 'deuxmille' },
    { valeur: 1000, id: 'mille' },
    { valeur: 500, id: 'cinqcent' },

    // { valeur: 10000, id: "dixmille" },
    // { valeur: 5000, id: "cinqmille"},
    // { valeur: 2000, id: "2000" },
    // { valeur: 1000, id: "mille" },
    // { valeur: 500, id: "cinqcent" },
  ];
  const [piece, setPiece] = useState({});
  const pieces = [
    { valeur: 500, id: 'cinqcent' },
    { valeur: 250, id: 'deuxcentcinquante' },
    { valeur: 200, id: 'deuxcent' },
    { valeur: 100, id: 'cent' },
    { valeur: 50, id: 'cinqante' },
    { valeur: 25, id: 'vingtcinq' },
    { valeur: 10, id: 'dix' },
    { valeur: 5, id: 'cinq' },

    // { valeur: 500, id: "cinqcent" },
    // { valeur: 250, id: "deuxcentcinquante" },
    // { valeur: 200, id: "deuxcent" },
    // { valeur: 100, id: "cent" },
    // { valeur: 50, id: "cinqante" },
    // { valeur: 25, id: "vingtcinq" },
    // { valeur: 10, id: "dix" },
    // { valeur: 5, id: "cinq" },
  ];

  const handleInputArretePieces = e => {
    const id = e.target.id;
    const value = e.target.value;
    setPiece({ ...piece, [id]: value });
    setSoldePhysique(parseInt(value) + soldePhysique);
    console.log(piece);
  };
  const handleInputArreteBillets = e => {
    const id = e.target.id;
    const value = e.target.value;
    setBillet({ ...billet, [id]: value });
    setSoldePhysique(parseInt(value) + soldePhysique);
    console.log(id);
  };

  const seletedColor = item => {
    selectedArticle.forEach(e => {
      if (item.id == e.id) {
        return selectedArctileView;
      }
      return normalArticleView;
    });
  };
  const toggleSidebar = event => {
    let key = `${event.currentTarget.parentNode.id}leftOpen`;
    console.log(key);
    setState({ [key]: !state[key] });
    console.log('***', state);
  };
  useEffect(() => {
    state.leftOpen ? setLeftOpen('open') : setLeftOpen('closed');
  }, [state.leftOpen]);

  const TableArrete = () => {
    return (
      <>
        <Row>
          <div className="col">
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
                    handleDelete(deleteId, 'encaissement');
                    setOpen(false);
                  }}
                >
                  Oui
                </Button>
              </DialogActions>
            </Dialog>
            <div
              style={{
                background: '',
                display: 'flex',
                border: '2px solid #626262',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '10px 0',
              }}
            >
              <span style={{ fontSize: 14, color: '#000' }}>
                {'Nom de entité'}
              </span>
            </div>
            <div
              style={{
                background: '',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 0',
              }}
            >
              <span style={{ fontSize: 14 }}>
                {moment(new Date()).format('DD/MM/YYYY HH:mm')}
              </span>
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Billets</th>
                  <th style={thStyle}>Quantité</th>
                  <th style={thStyle}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {billets.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{FormatNumber(item.valeur)}</td>
                    <td style={tdStyle}>
                      <input
                        style={{ border: 'none' }}
                        id={item.id}
                        disabled={loading}
                        placeholder="0"
                        type="number"
                        onChange={handleInputArreteBillets}
                      />
                    </td>
                    {/* <td style={tdStyle}>{FormatNumber(parseInt(billet.item.id))}</td> */}
                    <td style={tdStyle}>{`${billet}${item.id}`}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    style={{
                      padding: '4px',
                      fontWeight: '600',
                      // backgroundColor: '#f2f2f2',
                      textAlign: 'left',
                      borderLeft: '2px solid #626262',
                    }}
                  >
                    Pièces
                  </td>
                  <td style={{ tdStyle }}></td>
                  <td style={{ borderRight: '2px solid #626262' }}></td>
                </tr>
                {pieces.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{FormatNumber(item.valeur)}</td>
                    <td style={tdStyle}>
                      <input
                        style={{ border: 'none' }}
                        id={item.id}
                        disabled={loading}
                        placeholder="0"
                        type="number"
                        onChange={handleInputArretePieces}
                      />
                    </td>
                    <td style={tdStyle}>{FormatNumber(item.valeur)}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    style={{
                      borderBottom: '2px solid #626262',
                      padding: '2px 4px',
                      fontWeight: '600',
                      borderLeft: '2px solid #626262',
                    }}
                  >
                    {'Solde physique (a)'}
                  </td>
                  <td style={{ borderBottom: '2px solid #626262' }}></td>
                  <td style={soldeStyle}>{FormatNumber(soldePhysique)} F</td>
                </tr>
                <tr>
                  <td
                    style={{
                      borderBottom: '2px solid #626262',
                      padding: '2px 4px',
                      fontWeight: '600',
                      borderLeft: '2px solid #626262',
                    }}
                  >
                    {'Solde théorique (b)'}
                  </td>
                  <td style={{ borderBottom: '2px solid #626262' }}></td>
                  <td style={soldeStyle}>{FormatNumber(solde)} F</td>
                </tr>
                <tr>
                  <td
                    style={{
                      borderBottom: '2px solid #626262',
                      padding: '2px 4px',
                      fontWeight: '600',
                      borderLeft: '2px solid #626262',
                    }}
                  >
                    {'(a-b)'}
                  </td>
                  <td style={{ borderBottom: '2px solid #626262' }}></td>
                  <td style={soldeStyle}>
                    {FormatNumber(soldePhysique - solde)} F
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                display: 'flex',
                border: '2px solid #626262',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '5px 0',
                marginTop: '20px',
              }}
            >
              <span style={{ fontSize: 14, color: '#000' }}>
                {"Commentaire sur l'écart"} / {comment}
              </span>
            </div>
            <div
              style={{
                background: '',
                height: '8%',
                display: 'flex',
                borderBottom: '2px solid #626262',
                borderLeft: '2px solid #626262',
                borderRight: '2px solid #626262',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '5px 0',
              }}
            >
              <input
                style={{ border: 'none', width: '99%' }}
                disabled={loading}
                placeholder="Commentaire"
                type="text"
                onChange={e => {
                  setComment(e.target.value);
                }}
              />
            </div>
          </div>
        </Row>
      </>
    );
  };

  return (
    <>
      {/* <div style={{background: 'red', height: '0px'}}>
      <NavBarAccueil />
      </div> */}
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
      <InputModal
        modalTitle={'Ajouter un client'}
        onClick={HandleAddClient}
        loading={loading}
        error={error}
        showModal={showModal}
        toggleModal={toggleModal}
      >
        <Form>
          <Row>
            <Col md="12">
              <FormGroup>
                <InputGroup className="mb-4 input-group-alternative">
                  <Input
                    id="nom"
                    disabled={loading}
                    placeholder="Nom"
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
                    id="prenoms"
                    disabled={loading}
                    placeholder="Prénoms"
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
                    id="adresse"
                    disabled={loading}
                    placeholder="Adresse"
                    type="text"
                    onChange={handleInput}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <InputGroup className="mb-4 input-group-alternative">
                  <Input
                    id="number"
                    disabled={loading}
                    placeholder="Téléphone"
                    type="tel"
                    onChange={handleInput}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </InputModal>
      <PrintModal
        // onClick={HandleAddClient}
        // loading={loading}
        // error={error}
        showModal={showPrintModal}
        toggleModal={togglePrintModal}
        data={selectedArticle}
        montant={montant}
        client={selectedClient}
        montantRegle={montantRegle}
        montantRendu={montantArendre}
      ></PrintModal>
      <ModalArrete showModal={showModalArrete} toggleModal={toggleModalArrete}>
        {TableArrete()}
      </ModalArrete>
      {/* Page content */}
      {/* <Container className="mt-0" fluid> */}
      <div
        id="left"
        className={`accueill_main_div ${leftOpen}`}
        style={{ height: height }}
      >
        <div
          style={{
            background: '#fff',
            height: '7%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="menu_boutton_" onClick={toggleSidebar}>
            &#9776;
          </span>
          {/* <select required id={"categorie"}
            onChange={(e) => {
              setCategorie(e.target.value)
            }}
          >
            <option selected="selected" disabled hidden>Choisir</option>
            {
              famille.map((item, id) => (
                <option value={item.intituleFamille} label={item.intituleFamille} />
              ))
            }
          </select> */}
          <div
            style={{
              background: '#F0F0F0',
              padding: '6px',
              width: '30%',
              borderRadius: '4px',
            }}
          >
            <i className="fas fa-chart-pie" />
            <span style={{ padding: '0 10px', fontWeight: 'bold' }}>
              Solde :{' '}
            </span>
            <span
              style={{ padding: '0 5px', color: '#2dce89', fontWeight: '500' }}
            >
              {' '}
              {FormatNumber(solde)} CFA
            </span>
          </div>
          <Nav>
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      height={'100%'}
                      width={'100%'}
                      src={
                        user?.photoURL
                          ? user?.photoURL
                          : require('../assets/img/theme/user.jpg')
                      }
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user?.nom} {user?.prenoms}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Bienvenue!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Mon profil</span>
                </DropdownItem>
                <DropdownItem to="/admin/parametres" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Paramètres</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  // onClick={(e) => e.handleSignout}
                  onClick={() => handleSignout()}
                >
                  <i className="ni ni-user-run" />
                  <span>Déconnexion</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </div>
        <div
          style={{
            background: '#303135',
            height: '93%',
            padding: '0.5%',
            width: '100%',
            alignSelf: 'center',
            // textAlign: 'right',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '65%',
              background: '',
              height: '100%',
              padding: '0',
            }}
          >
            <div
              style={{
                // background: '#60D5B1',
                height: '100%',
                width: '100%',
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start',
              }}
            >
              <div
                className="CategorieCardDiv"
                style={{ maxHeight: height - 60 }}
              >
                {famille.length > 0
                  ? famille.map((item, index) => (
                      // (index == 0 ? setCategorie(item.id) : null),
                      <div
                        style={
                          selectedId === item.id || selectedId == index
                            ? selectedView
                            : normalView
                        }
                        onClick={() => {
                          handlePress(item.id);
                          console.log(item.id);
                          setCategorie(item.intituleFamille);
                        }}
                        className="CategorieSmallCard"
                      >
                        <img
                          alt="..."
                          style={{
                            borderRadius: '100%',
                            padding: '5px',
                            margin: '0 8px',
                            background: `${
                              selectedId === item.id ? '#fff' : '#C0C0C0'
                            }`,
                          }}
                          height={'30px'}
                          width={'30px'}
                          src={item.icon}
                        />
                        <span
                          style={{
                            width: '90%',
                            textAlign: 'left',
                            padding: '0 5px',
                          }}
                        >
                          {item.intituleFamille}
                        </span>
                      </div>
                    ))
                  : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
                      <div
                        key={index}
                        style={{
                          height: '45px',
                          margin: '5px 2px',
                          background: '#f5f5f5',
                          width: '99%',
                          padding: '3px 0',
                          textAlign: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        className="CategorieSmallCard"
                      ></div>
                    ))}
              </div>
              <div
                id="flexWrapDetailCategorie"
                style={{ maxHeight: height - 60 }}
              >
                {filteredArticle.length > 0 ? (
                  filteredArticle.map((item, index) => (
                    <div
                      // style={normalArticleView}
                      style={{
                        background: `url(${item.img}) 95px 97px no-repeat #f5f5f5`,
                        backgroundSize: 'cover',
                        // background: '#eff2f3',
                        backgroundPosition: 'center',
                        textAlign: 'center',
                        height: '130px',
                        margin: '5px 5px',
                        minWidth: '18%',
                        maxWidth: '18%',
                        flexDirection: 'column',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '3px 8px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        // handlePress(item.id)
                        createArticleList(item);
                      }}
                    >
                      <span
                        style={{
                          borderTopLeftRadius: '4px',
                          borderTopRightRadius: '4px',
                        }}
                      >
                        {item.intituleArticle}
                      </span>
                      <span
                        style={{
                          fontWeight: '400',
                          borderBottomLeftRadius: '4px',
                          borderBottomRightRadius: '4px',
                        }}
                      >
                        {FormatNumber(item.prix)} CFA
                      </span>
                      {/* <div>
                      </div> */}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      height: height - 80,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h3
                      style={{
                        color: '#fff',
                        fontSize: '17px',
                        background: '',
                        borderRadius: '5px',
                      }}
                    >
                      Pas d'article !
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              background: '#fff',
              height: '100%',
              overflow: 'scroll',
              // fontSize: '13px',
              width: '35%',
              borderRadius: '5px',
              // marginRight: '15px',
              padding: '10px 0px',
            }}
          >
            <div
              style={{
                height: '3%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '99%',
                margin: '3px',
                paddingTop: '2px',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  background: '#F96131',
                  borderRadius: '5px',
                  marginLeft: '12px',
                  padding: '2px 0',
                }}
              >
                <select
                  required
                  id={'categorie'}
                  onChange={e => {
                    setSelectedClient(e.target.value);
                  }}
                  style={{ color: '#fff' }}
                >
                  <option
                    selected="selected"
                    disabled
                    hidden
                    style={{ color: '#fff' }}
                  >
                    Client
                  </option>
                  {client.map((item, id) => (
                    <option
                      value={item.displayname}
                      label={item.displayname}
                      style={{ color: '#000' }}
                    />
                  ))}
                </select>
              </div>
              <Button
                style={{
                  background: '#fff',
                  color: '#32D689',
                  marginRight: '12px',
                  width: '120px',
                  fontSize: '13px',
                  borderRadius: '5px',
                  padding: '1px 0',
                  border: '2px solid #32D689',
                }}
                className="my-4"
                type="button"
                onClick={() => setShowModal(true)}
              >
                Ajouter
              </Button>
            </div>
            <div style={{}} className="div-details-vente-card">
              {selectedArticle ? (
                <Card
                  style={{
                    borderRadius: '10px',
                    border: '0',
                    background: '#F7F7F7',
                    height: '100%',
                    margin: '15px 15px',
                  }}
                >
                  <Table className="align-items-center table-flush" responsive>
                    <tbody>
                      {selectedArticle.map(
                        (items, index) => (
                          console.log(items),
                          (
                            <tr
                              onClick={() => {
                                setSelectedArticle([
                                  ...selectedArticle.slice(0, index),
                                  ...selectedArticle.slice(index + 1),
                                ]);
                                setTotal(
                                  montant -
                                    parseInt(items.prix) *
                                      parseInt(items.quantity)
                                );
                              }}
                              style={{ fontSize: '3px' }}
                            >
                              <td>
                                <span className=" ml-3">{items.quantity} </span>
                                <span className=" ml-3">
                                  {items.intituleArticle}
                                </span>
                              </td>
                              <td className="text-right">
                                {FormatNumber(items.prix)} CFA
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </Table>
                </Card>
              ) : null}
            </div>
            <div
              style={{
                height: '50%',
                background: '#fff',
                margin: '2px 0',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                borderRadius: '1px',
              }}
            >
              <div
                style={{
                  width: '95%',
                  background: '#E2E2E2',
                  color: '#000',
                  fontSize: '13px',
                  margin: '2px 12px 0 12px',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              >
                <div
                  style={{
                    height: '6%',
                    padding: '2px 0 0 0',
                    width: '98%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className=" ml-3 " style={{ textAlign: 'center' }}>
                    Total
                  </span>
                  <span className=" mr-3 " style={{ textAlign: 'center' }}>
                    {FormatNumber(montant)} FCFA
                  </span>
                </div>
                <hr className="my-1" />
                <div
                  style={{
                    padding: '0',
                    width: '98%',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className=" ml-3 " style={{ textAlign: 'center' }}>
                    A rendre
                  </span>
                  {montantArendre ? (
                    <span className=" mr-3 " style={{ textAlign: 'center' }}>
                      {FormatNumber(montantArendre)} FCFA
                    </span>
                  ) : null}
                </div>
                <hr className="my-0" />
              </div>
              <div className="div_cliavier_visuel_">
                <Clavier
                  input={montantRegle}
                  onChange={value => {
                    console.log('onchange', value);
                    const mtt = value - montant;
                    setMontantRegle(value);
                    setMontantArendre(mtt);
                  }}
                  onChangeInput={e => {
                    console.log('onchange', e.target.value);
                    const mtt = e.target.value - montant;
                    setMontantRegle(e.target.value);
                    setMontantArendre(mtt);
                    console.log(mtt);
                    // keyboard.current.setMontantRegle(e.target.value);
                  }}
                  keyboardRef={r => (keyboard.current = r)}
                />
              </div>
              <div
                style={{
                  height: '10.5%',
                  background: '#fff',
                  display: 'flex',
                  padding: '0px 0 0 0px',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  borderRadius: '3px',
                }}
              >
                {/* <div className='div_button_cash'>
                  <UncontrolledDropdown nav style={{ height: "100%", width: '100%', padding: "0px" }}>
                    <DropdownToggle nav style={{ height: "100%", width: '100%', padding: "0px" }}>
                      <span className=" ml-0 " id='caisse_button_' style={{ textAlign: 'center', }}>Caisse</span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      {
                        caisse.map((item, index) => (
                          <DropdownItem to="/admin/user-profile" key={index}
                            onClick={() => {
                              setSelectedCaisse(item.intituleCaisse)
                            }}
                          >
                            <span>{item.intituleCaisse}</span>
                          </DropdownItem>
                        ))
                      }
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div> */}
                <Link className="div_button_cash" to="/admin/operations">
                  <span className=" " style={{ textAlign: 'center' }}>
                    Ventes
                  </span>
                </Link>
                <div className="div_button_cash" onClick={HandleAdd}>
                  <span className=" " style={{ textAlign: 'center' }}>
                    {loading ? 'En cours...' : 'Valider'}
                  </span>
                </div>
                <div
                  className="div_button_cash"
                  onClick={() => {
                    if (selectedArticle.length < 1) {
                    } else {
                      notifySuccess('Vente annulée');
                      setSelectedArticle([]);
                      setSelectedCaisse(null);
                      setMontantArendre(0);
                      setSelectedClient(null);
                      setTotal(0);
                    }
                  }}
                >
                  <span className=" " style={{ textAlign: 'center' }}>
                    {'Annuler'}
                  </span>
                </div>
                <div
                  className="div_button_cash"
                  onClick={() => {
                    if (1 == 11) {
                      notifyError("Veuillez selectionner un article d'abord");
                    } else {
                      setShowModalArrete(true);
                    }
                  }}
                >
                  <span className=" ml-0" style={{ textAlign: 'center' }}>
                    Arrêté
                  </span>
                </div>
              </div>
              {/* <div style={{display: 'flex', alignItems: "center", color: '#000', justifyContent: 'space-between',}}>
                {
                  user.caisse ? 
                  <span className=" ml-3" style={{textAlign: 'center', fontWeight: "500", fontSize: '13px', padding: "5px 0 0 0"}}>CAISSE : {user.caisse}</span>
                  : null
                }
                {
                  selectedClient ? 
                  <span className=" mr-3 ml-3" style={{textAlign: 'center', fontWeight: "500", fontSize: '13px', padding: "5px 0 0 0"}}>CLIENT : {selectedClient}</span>
                  : null
                }
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* </Container> */}
    </>
  );
};

export default Index;
