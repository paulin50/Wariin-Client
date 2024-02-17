import React from 'react';

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Button as ButtonRS,
  // Button,
  Container,
  Row,
  UncontrolledTooltip,
  Col,
  CardBody,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import ReactDatetime from 'react-datetime';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  collection,
  deleteDoc,
  query,
  doc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
// core components
import NavBar from '../../Views/Headers/NavBar';
import { useState } from 'react';
import ExcelConverter from '../../view/components/ExcelFile';
import moment from 'moment';
import 'moment/locale/fr';
import FormatNumber from '../../Converter/Convert';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import InputModal from '../../view/components/InputModal';
import ModalMouvement from '../../view/components/ModalMouvement';
moment.locale('fr');

const Depenses = () => {
  const {
    currentUser,
    users,
    famille,
    encaissement,
    caisse,
    depense,
    user,
    solde,
  } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [showModalFilterDepense, setShowModalFilterDepense] = useState(false);
  const [showModalFilterEncaiss, setShowModalFilterEncaiss] = useState(false);
  const [selectedButton, setSelectedButton] = useState('Decaissement');
  const notify = message => toast.error(message);
  const notifyDelete = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const notifyAdd = message => toast.success(message);
  const notifyInfo = message => toast.info(message);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredDepense, setFilteredDepense] = useState(depense);
  const [filteredEncaissement, setFilteredEncaissement] =
    useState(encaissement);
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    initiateur: 'Tous',
    caisseSelect: user.caisse,
  });
  // const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = filteredEncaissement;
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

  const itemsPerPageDe = 6; // Nombre d'éléments à afficher par page
  const [currentPageDe, setCurrentPageDe] = useState(1);
  const itemsDe = filteredDepense;
  // Calculer le nombre de pages
  const totalPagesDe = Math.ceil(items.length / itemsPerPageDe);
  // Récupérer les éléments à afficher sur la page courante
  const startIndexDe = (currentPageDe - 1) * itemsPerPageDe;
  const endIndexDe = startIndex + itemsPerPage;
  const currentItemsDe = itemsDe.slice(startIndexDe, endIndexDe);
  // Gérer le clic sur un lien de pagination
  const handleClickDe = pageNumber => {
    setCurrentPageDe(pageNumber);
  };

  const handleNo = () => {
    setOpen(false);
  };
  const handleInput = e => {
    const id = e.target.id;
    const value = e.target.value;
    console.log(id);
    setData({ ...data, [id]: value });
  };
  const HandleAdd = async db => {
    console.log(data);
    // e.preventDefault()
    if (data.libelle?.trim() && data.montant?.trim() && data.intituleCaisse) {
      setError('');
      setLoading(true);
      console.log(data);
      try {
        await addDoc(collection(db, 'encaissement'), {
          ...data,
          initiateur: user?.nom + ' ' + user?.prenoms,
          initiateurData: user,
          timeStamp: moment(new Date()).format('LLL'),
        }).then(async () => {
          try {
            await updateDoc(doc(db, 'solde', 'vHCXXnbA9SUwNd28yr3d'), {
              solde:
                db === 'encaissement'
                  ? parseInt(solde + parseInt(data.montant))
                  : parseInt(solde - parseInt(data.montant)),
              timeStamp: moment(new Date()).format('LLL'),
            }).then(() => {
              notifyAdd('Ajouter avec succes');
              setLoading(false);
              setData({});
            });
          } catch (error) {
            console.log(error);
          }
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
  const handleDelete = async (id, db) => {
    try {
      await deleteDoc(doc(db, db, id));
      notifyDelete('Supprimer avec succes');
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModalFilterDepense = () => {
    setShowModalFilterDepense(!showModalFilterDepense);
  };
  const toggleModalFilterEncaiss = () => {
    setShowModalFilterEncaiss(!showModalFilterEncaiss);
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const filterDepenseData = () => {
    const data = depense;
    console.log(filteredDepense);
    let var1 = state.initiateur;
    let var2 = state.caisseSelect;
    let startDate = moment(state.startDate).format('YYYY-MM-DD');
    let endDate = moment(state.endDate).format('YYYY-MM-DD');

    if (!state.startDate) {
      notify('Veuillez sélectionnez une date de débuit');
    } else if (!state.endDate) {
      notify('Veuillez sélectionnez une date de fin');
    } else {
      const filteredArray = data.filter(item => {
        const itemDate = moment(item.timeStamp, 'DD MMMM YYYY HH:mm').format(
          'YYYY-MM-DD'
        );
        if (
          (var1 === 'Tous' || var1 === '') &&
          (var2 === 'Tous' || var2 === '')
        ) {
          return itemDate >= startDate && itemDate <= endDate;
        } else if (var1 === 'Tous') {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.intituleCaisse === var2 &&
            typeof item.intituleCaisse !== 'undefined'
          );
        } else if (var2 === 'Tous') {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.initiateur === var1 &&
            typeof item.initiateur !== 'undefined'
          );
        } else {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.initiateur === var1 &&
            item.intituleCaisse === var2 &&
            typeof item.initiateur !== 'undefined' &&
            typeof item.intituleCaisse !== 'undefined'
          );
        }
      });
      setFilteredDepense(filteredArray);
      if (filteredArray.length == 0) {
        notify('Pas de données');
      } else {
        notifyAdd('Valider');
      }
      console.log('[#######]', filteredArray);
    }
  };
  const filterEncaissementData = () => {
    const data = encaissement;
    console.log(filteredEncaissement);
    let var1 = state.initiateur;
    let var2 = state.caisseSelect;
    let startDate = moment(state.startDate).format('YYYY-MM-DD');
    let endDate = moment(state.endDate).format('YYYY-MM-DD');

    if (!state.startDate) {
      notify('Veuillez sélectionnez une date de débuit');
    } else if (!state.endDate) {
      notify('Veuillez sélectionnez une date de fin');
    } else {
      const filteredArray = data.filter(item => {
        const itemDate = moment(item.timeStamp, 'DD MMMM YYYY HH:mm').format(
          'YYYY-MM-DD'
        );
        if (
          (var1 === 'Tous' || var1 === '') &&
          (var2 === 'Tous' || var2 === '')
        ) {
          return itemDate >= startDate && itemDate <= endDate;
        } else if (var1 === 'Tous') {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.intituleCaisse === var2 &&
            typeof item.intituleCaisse !== 'undefined'
          );
        } else if (var2 === 'Tous') {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.initiateur === var1 &&
            typeof item.initiateur !== 'undefined'
          );
        } else {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.initiateur === var1 &&
            item.intituleCaisse === var2 &&
            typeof item.initiateur !== 'undefined' &&
            typeof item.intituleCaisse !== 'undefined'
          );
        }
      });
      setFilteredEncaissement(filteredArray);
      if (filteredArray.length == 0) {
        notify('Pas de données');
      } else {
        notifyAdd('Valider');
      }
      console.log('[#######]', filteredArray);
    }
  };
  const createExcelFileDepense = async (dataItems, db) => {
    if (filteredDepense.length == 0) {
      notify('Aucune donnée sélectionnée');
    } else {
      let headCSV = ['Date', 'Libellé', 'Initiateur', 'Caisse', 'Montant'];
      let array = new Array(headCSV);
      dataItems.forEach(element => {
        function clean(obj) {
          for (var key in obj) {
            if (key === 'id') {
              delete obj[key];
            }
            if (key === 'codeCaisse') {
              delete obj[key];
            }
            if (key === 'initiateurData') {
              delete obj[key];
            }
          }
          return obj;
        }
        const cleanArray = clean(element);
        const myArray = new Array();
        myArray.splice(0, 0, cleanArray.timeStamp);
        myArray.splice(1, 0, cleanArray.libelle);
        myArray.splice(2, 0, cleanArray.initiateur);
        myArray.splice(3, 0, cleanArray.intituleCaisse);
        myArray.splice(4, 0, cleanArray.montant);
        array.push(myArray);
        console.log(array);
      });
      // console.log(array);
      notifyAdd('Exportation...');
      const filename = 'Les décaissements.xlsx';
      await ExcelConverter(array, filename);
    }
  };
  const createExcelFileEncaissement = async (dataItems, db) => {
    if (filteredEncaissement.length == 0) {
      notify('Aucune donnée sélectionnée');
    } else {
      let headCSV = ['Date', 'Libellé', 'Initiateur', 'Caisse', 'Montant'];
      let array = new Array(headCSV);
      dataItems.forEach(element => {
        function clean(obj) {
          for (var key in obj) {
            if (key === 'id') {
              delete obj[key];
            }
            if (key === 'codeCaisse') {
              delete obj[key];
            }
            if (key === 'initiateurData') {
              delete obj[key];
            }
          }
          return obj;
        }
        const cleanArray = clean(element);
        const myArray = new Array();
        myArray.splice(0, 0, cleanArray.timeStamp);
        myArray.splice(1, 0, cleanArray.libelle);
        myArray.splice(2, 0, cleanArray.initiateur);
        myArray.splice(3, 0, cleanArray.intituleCaisse);
        myArray.splice(4, 0, cleanArray.montant);
        array.push(myArray);
        console.log(array);
      });
      // console.log(array);
      notifyAdd('Exportation...');
      const filename = 'Les encaissements.xlsx';
      await ExcelConverter(array, filename);
    }
  };

  const TableEncaissement = () => {
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
            <ModalMouvement
              modalTitle={'Exportation en Excel'}
              modalButtonTitle={'Exportation'}
              onClick={() => filterEncaissementData()}
              onClickExport={() =>
                createExcelFileEncaissement(
                  filteredEncaissement,
                  'encaissement'
                )
              }
              loading={loading}
              error={error}
              showModal={showModalFilterEncaiss}
              toggleModal={toggleModalFilterEncaiss}
            >
              <Form>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          closeOnSelect
                          value={state.startDate}
                          inputProps={{
                            placeholder: 'Date débuit',
                          }}
                          timeFormat={false}
                          renderDay={(props, currentDate, selectedDate) => {
                            let classes = props.className;
                            if (
                              state.startDate &&
                              state.endDate &&
                              state.startDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' start-date';
                            } else if (
                              state.startDate &&
                              state.endDate &&
                              new Date(state.startDate._d + '') <
                                new Date(currentDate._d + '') &&
                              new Date(state.endDate._d + '') >
                                new Date(currentDate._d + '')
                            ) {
                              classes += ' middle-date';
                            } else if (
                              state.endDate &&
                              state.endDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' end-date';
                            }
                            return (
                              <td {...props} className={classes}>
                                {currentDate.date()}
                              </td>
                            );
                          }}
                          onChange={e => {
                            setState({ ...state, startDate: e }) &&
                              filterEncaissementData();
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          closeOnSelect
                          value={state.endDate}
                          inputProps={{
                            placeholder: 'Date fin',
                          }}
                          timeFormat={false}
                          renderDay={(props, currentDate, selectedDate) => {
                            let classes = props.className;
                            if (
                              state.startDate &&
                              state.endDate &&
                              state.startDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' start-date';
                            } else if (
                              state.startDate &&
                              state.endDate &&
                              new Date(state.startDate._d + '') <
                                new Date(currentDate._d + '') &&
                              new Date(state.endDate._d + '') >
                                new Date(currentDate._d + '')
                            ) {
                              classes += ' middle-date';
                            } else if (
                              state.endDate &&
                              state.endDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' end-date';
                            }
                            return (
                              <td {...props} className={classes}>
                                {currentDate.date()}
                              </td>
                            );
                          }}
                          onChange={e => {
                            setState({ ...state, endDate: e }) &&
                              filterEncaissementData();
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative">
                        <select
                          required
                          id={'initiateur'}
                          className="caisse"
                          onChange={e => {
                            setState({ ...state, initiateur: e.target.value });
                          }}
                        >
                          <option selected="selected" disabled hidden>
                            {state.initiateur || 'Initiateur'}
                          </option>
                          <option value={'Tous'} label={'Tous'}></option>
                          {users?.map((items, index) => (
                            <option
                              key={index}
                              value={items.nom + ' ' + items.prenoms}
                              label={items.nom + ' ' + items.prenoms}
                            />
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative" >
                        <select required id={"intituleCaisse"} className="caisse"
                          onChange={e => {
                            setState({ ...state, caisseSelect: e.target.value })
                          }}>
                          <option selected="selected" disabled hidden>{state.caisseSelect || "Caisse"}</option>
                          <option value={"Tous"} label={"Tous"}></option>
                          {
                            caisse?.map((items, index) => (
                              <option key={index} value={items.intituleCaisse} label={items.intituleCaisse} />
                            ))
                          }
                        </select>
                      </InputGroup>
                    </FormGroup>
                  </Col> */}
                </Row>
              </Form>
            </ModalMouvement>
            <InputModal
              modalTitle={'Ajouter un encaissement'}
              onClick={() => HandleAdd('encaissement')}
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
                          id="libelle"
                          disabled={loading}
                          placeholder="Libellé"
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
                          id="montant"
                          disabled={loading}
                          placeholder="Montant en CFA"
                          type="number"
                          onChange={handleInput}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                {/* <Row>
                  <Col md="12">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative" >
                        <select required id={"intituleCaisse"} className="caisse" onChange={handleInput}>
                          <option selected="selected" disabled hidden>Caisse</option>
                          {
                            caisse?.map((items, index) => (
                              <option key={index} value={items.intituleCaisse} label={items.intituleCaisse} />
                            ))
                          }
                        </select>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row> */}
              </Form>
            </InputModal>
            <Card
              className=""
              style={{
                height: 453,
                borderBottomRightRadius: 18,
                borderBottomLeftRadius: 18,
              }}
            >
              <CardHeader className="border-0">
                <Row>
                  <Col md="9">
                    <h3 className="mb-0">Les encaissements</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col"/> */}
                    <th scope="col">Date </th>
                    <th scope="col">Libellé </th>
                    <th scope="col">Initiateur </th>
                    <th scope="col">Caisse </th>
                    <th scope="col">Montant</th>
                    {/* <th scope="col">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((items, index) => (
                    <tr>
                      <td>{items.timeStamp}</td>
                      <td>{items.libelle}</td>
                      <td>{items.initiateur}</td>
                      <td>{items.intituleCaisse}</td>
                      <td>{FormatNumber(items.montant)} CFA</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter
                className="py-4"
                style={{
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 18,
                }}
              >
                <nav aria-label="...">
                  <Pagination>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handleClick(currentPage - 1)}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i} active={i + 1 === currentPage}>
                        <PaginationLink onClick={() => handleClick(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        next
                        onClick={() => handleClick(currentPage + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </>
    );
  };
  const TableDecaissement = () => {
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
                    handleDelete(deleteId, 'depense');
                    setOpen(false);
                  }}
                >
                  Oui
                </Button>
              </DialogActions>
            </Dialog>
            <ModalMouvement
              modalTitle={'Exportation en Excel'}
              modalButtonTitle={'Exportation'}
              onClick={() => filterDepenseData()}
              onClickExport={() =>
                createExcelFileDepense(filteredDepense, 'depense')
              }
              loading={loading}
              error={error}
              showModal={showModalFilterDepense}
              toggleModal={toggleModalFilterDepense}
            >
              <Form>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          closeOnSelect
                          value={state.startDate}
                          inputProps={{
                            placeholder: 'Date débuit',
                          }}
                          timeFormat={false}
                          renderDay={(props, currentDate, selectedDate) => {
                            let classes = props.className;
                            if (
                              state.startDate &&
                              state.endDate &&
                              state.startDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' start-date';
                            } else if (
                              state.startDate &&
                              state.endDate &&
                              new Date(state.startDate._d + '') <
                                new Date(currentDate._d + '') &&
                              new Date(state.endDate._d + '') >
                                new Date(currentDate._d + '')
                            ) {
                              classes += ' middle-date';
                            } else if (
                              state.endDate &&
                              state.endDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' end-date';
                            }
                            return (
                              <td {...props} className={classes}>
                                {currentDate.date()}
                              </td>
                            );
                          }}
                          onChange={e => {
                            setState({ ...state, startDate: e }) &&
                              filterDepenseData();
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          closeOnSelect
                          value={state.endDate}
                          inputProps={{
                            placeholder: 'Date fin',
                          }}
                          timeFormat={false}
                          renderDay={(props, currentDate, selectedDate) => {
                            let classes = props.className;
                            if (
                              state.startDate &&
                              state.endDate &&
                              state.startDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' start-date';
                            } else if (
                              state.startDate &&
                              state.endDate &&
                              new Date(state.startDate._d + '') <
                                new Date(currentDate._d + '') &&
                              new Date(state.endDate._d + '') >
                                new Date(currentDate._d + '')
                            ) {
                              classes += ' middle-date';
                            } else if (
                              state.endDate &&
                              state.endDate._d + '' === currentDate._d + ''
                            ) {
                              classes += ' end-date';
                            }
                            return (
                              <td {...props} className={classes}>
                                {currentDate.date()}
                              </td>
                            );
                          }}
                          onChange={e => {
                            setState({ ...state, endDate: e }) &&
                              filterEncaissementData();
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative">
                        <select
                          required
                          id={'initiateur'}
                          className="caisse"
                          onChange={e => {
                            setState({ ...state, initiateur: e.target.value });
                          }}
                        >
                          <option selected="selected" disabled hidden>
                            {state.initiateur || 'Initiateur'}
                          </option>
                          <option value={'Tous'} label={'Tous'}></option>
                          {users?.map((items, index) => (
                            <option
                              key={index}
                              value={items.nom + ' ' + items.prenoms}
                              label={items.nom + ' ' + items.prenoms}
                            />
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative" >
                        <select required id={"intituleCaisse"} className="caisse"
                          onChange={e => {
                            setState({ ...state, caisseSelect: e.target.value })
                          }}>
                          <option selected="selected" disabled hidden>{state.caisseSelect || "Caisse"}</option>
                          <option value={"Tous"} label={"Tous"}></option>
                          {
                            caisse?.map((items, index) => (
                              <option key={index} value={items.intituleCaisse} label={items.intituleCaisse} />
                            ))
                          }
                        </select>
                      </InputGroup>
                    </FormGroup>
                  </Col> */}
                </Row>
              </Form>
            </ModalMouvement>
            <InputModal
              modalTitle={'Ajouter un décaissement'}
              onClick={() => HandleAdd('depense')}
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
                          id="libelle"
                          disabled={loading}
                          placeholder="Libellé"
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
                          id="montant"
                          disabled={loading}
                          placeholder="Montant en CFA"
                          type="number"
                          onChange={handleInput}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                {/* <Row>
                  <Col md="12">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative" >
                        <select required id={"intituleCaisse"} className="caisse" onChange={handleInput}>
                          <option selected="selected" disabled hidden>Caisse</option>
                          {
                            caisse?.map((items, index) => (
                              <option key={index} value={items.intituleCaisse} label={items.intituleCaisse} />
                            ))
                          }
                        </select>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row> */}
              </Form>
            </InputModal>
            <Card
              className=""
              style={{
                height: 453,
                borderBottomRightRadius: 18,
                borderBottomLeftRadius: 18,
              }}
            >
              <CardHeader className="border-0">
                <Row>
                  <Col md="9">
                    <h3 className="mb-0">Les décaissements</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Date </th>
                    <th scope="col">Libellé </th>
                    <th scope="col">Initiateur </th>
                    <th scope="col">Caisse </th>
                    <th scope="col">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsDe.map((items, index) => (
                    <tr>
                      <td>{items.timeStamp}</td>
                      <td>{items.libelle}</td>
                      <td>{items.initiateur}</td>
                      <td>{items.intituleCaisse}</td>
                      <td>{FormatNumber(items.montant)} CFA</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter
                className="py-4"
                style={{
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 18,
                }}
              >
                <nav aria-label="...">
                  <Pagination>
                    <PaginationItem disabled={currentPageDe === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handleClickDe(currentPageDe - 1)}
                      />
                    </PaginationItem>
                    {[...Array(totalPagesDe)].map((_, i) => (
                      <PaginationItem key={i} active={i + 1 === currentPageDe}>
                        <PaginationLink onClick={() => handleClick(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPageDe === totalPagesDe}>
                      <PaginationLink
                        next
                        onClick={() => handleClick(currentPageDe + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </>
    );
  };

  return (
    <>
      <NavBar />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row style={{ background: '' }}>
          <Col xl="12">
            <Card
              className="shadow"
              style={{ background: '#F96131', borderRadius: '18px' }}
            >
              <CardBody>
                <div className="div_card_">
                  <div className="div_card_left_">
                    <div className="" style={{ display: 'flex' }}>
                      <div
                        // className="button_mouvenemt_ left mr-0"
                        className={
                          selectedButton == 'Decaissement'
                            ? 'button_mouvenemt_selected left mr-0'
                            : 'button_mouvenemt_ left mr-0'
                        }
                        onClick={() => setSelectedButton('Decaissement')}
                      >
                        <span color="#000">Décaissement</span>
                      </div>
                      <div
                        className={
                          selectedButton == 'Encaissement'
                            ? 'button_mouvenemt_selected right ml-0'
                            : 'button_mouvenemt_ right ml-0'
                        }
                        onClick={() => setSelectedButton('Encaissement')}
                      >
                        <span>Encaissement</span>
                      </div>
                    </div>
                    {selectedButton == 'Decaissement' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          height: '92%',
                        }}
                      >
                        <span>Les décaissements</span>
                        <img
                          alt="..."
                          width={'80%'}
                          height={'50%'}
                          src={require('./caisse.jpg')}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          height: '92%',
                        }}
                      >
                        <span>Les encaissements</span>
                        <img
                          alt="..."
                          width={'80%'}
                          height={'50%'}
                          src={require('./caisse2.jpg')}
                        />
                      </div>
                    )}
                  </div>
                  {selectedButton == 'Decaissement' ? (
                    <div className="div_card_right_">
                      <div className="" style={{ display: 'flex' }}>
                        <ButtonRS
                          className="button_mouvenemt_ left mr-0"
                          onClick={toggleModal}
                        >
                          <span>Ajouter</span>
                        </ButtonRS>
                        <ButtonRS
                          className="button_mouvenemt_ right ml-0"
                          onClick={() => setShowModalFilterDepense(true)}
                        >
                          <span color="#000">Exporter en Excel</span>
                        </ButtonRS>
                      </div>
                      <div style={{ borderRadius: 18 }}>
                        {/* <TableDecaissement 
                          showModal={showModal} 
                          toggleModal={toggleModal}
                        /> */}
                        {TableDecaissement()}
                      </div>
                    </div>
                  ) : (
                    <div className="div_card_right_">
                      <div className="" style={{ display: 'flex' }}>
                        <ButtonRS
                          className="button_mouvenemt_ left mr-0"
                          onClick={toggleModal}
                        >
                          <span>Ajouter</span>
                        </ButtonRS>
                        <ButtonRS
                          className="button_mouvenemt_ right ml-0"
                          onClick={() => setShowModalFilterEncaiss(true)}
                          // onClick={() => createExcelFileEncaissement(currentItems, "encaissement")}
                        >
                          <span color="#000">Exporter en Excel</span>
                        </ButtonRS>
                      </div>
                      <div>
                        {/* <TableEncaissement 
                          // showModal={showModal} 
                          // toggleModal={toggleModal} 
                        /> */}
                        {TableEncaissement()}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Depenses;
