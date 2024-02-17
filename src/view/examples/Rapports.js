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
  Timestamp,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
// core components
import NavBar from '../../Views/Headers/NavBar';
import { useState } from 'react';
import ExcelConverter from '../../view/components/ExcelFile';
import moment from 'moment';
import 'moment/locale/fr';
import { useEffect } from 'react';
import FormatNumber from '../../Converter/Convert';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import ModalOperation from '../../view/components/ModalOperation';
moment.locale('fr');

const Rapports = () => {
  const { currentUser, vente, journal, client, caisse, depense, user, solde } =
    useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [showModalFilterJournal, setShowModalFilterJournal] = useState(false);
  const [showModalFilterVente, setShowModalFilterVente] = useState(false);
  const [selectedButton, setSelectedButton] = useState('Vente');
  const notify = message => toast.error(message);
  const notifyDelete = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const notifyAdd = message => toast.success(message);
  const notifyInfo = message => toast.info(message);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [journalTable, setJournalTable] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [filteredJournal, setFilteredJournal] = useState([]);
  const [filteredVente, setFilteredVente] = useState(vente);
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    tableVente: vente,
    tableDepense: depense,
    personne: user.caisse,
  });

  useEffect(() => {
    if (vente.length > 0 && depense.length > 0) {
      console.log('vente', vente.length);
      console.log('depense', depense.length);
      for (let i = 0; i < depense.length || i < vente.length; i++) {
        if (vente[i]) {
          if (journalTable.length <= vente.length + depense.length) {
            let leSolde = solde + state.tableVente[i].total;
            journalTable.push({
              timeStamp: state.tableVente[i].timeStamp,
              libelle: state.tableVente[i].caisse,
              entre: state.tableVente[i].total,
              solde: leSolde,
            });
          }
          // setJournalTable([...journalTable,
          //   { timeStamp: vente[i].timeStamp, libelle: vente[i].caisse, entre: vente[i].prix }
          // ])
        }
        if (depense[i]) {
          if (journalTable.length <= vente.length + depense.length) {
            let leSolde = solde - parseInt(state.tableDepense[i].montant);
            journalTable.push({
              timeStamp: state.tableDepense[i].timeStamp,
              sortie: state.tableDepense[i].montant,
              libelle: state.tableDepense[i].libelle,
              solde: leSolde,
            });
          }
          // setJournalTable([...journalTable,
          //   { timeStamp: depense[i].timeStamp, sortie: depense[i].montant, libelle: depense[i].libelle }
          // ])
        }
      }
    }
  }, []);

  const [filteredJournal, setFilteredJournal] = useState(journalTable);

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = filteredJournal;
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

  const itemsPerPageVente = 6; // Nombre d'éléments à afficher par page
  const [currentPageVente, setCurrentPageVente] = useState(1);
  const itemsVente = filteredVente;
  // Calculer le nombre de pages
  const totalPagesVente = Math.ceil(itemsVente.length / itemsPerPageVente);
  // Récupérer les éléments à afficher sur la page courante
  const startIndexVente = (currentPageVente - 1) * itemsPerPageVente;
  const endIndexVente = startIndexVente + itemsPerPageVente;
  const currentItemsVente = itemsVente.slice(startIndexVente, endIndexVente);
  // Gérer le clic sur un lien de pagination
  const handleClickVente = pageNumber => {
    setCurrentPageVente(pageNumber);
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

  const toggleModalFilterJournal = () => {
    setShowModalFilterJournal(!showModalFilterJournal);
  };
  const toggleModalFilterVente = () => {
    setShowModalFilterVente(!showModalFilterVente);
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const filterJournalData = () => {
    const data = journalTable;
    let caisse = state.caisseSelect;
    // console.log(filteredJournal);
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
        console.log(item);
        if (caisse === 'Tous' || caisse === '') {
          return itemDate >= startDate && itemDate <= endDate;
        } else {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.intituleCaisse === caisse &&
            typeof item.intituleCaisse !== 'undefined'
          );
        }
      });
      setFilteredJournal(filteredArray);
      if (filteredArray.length == 0) {
        notify('Pas de données');
      } else {
        notifyAdd('Valider');
      }
      console.log('[#######]', filteredArray);
    }
  };
  const filterVenteData = () => {
    const data = vente;
    let var1 = state.personne;
    let var2 = state.caisseSelect;
    let startDate = moment(state.startDate).format('YYYY-MM-DD');
    let endDate = moment(state.endDate).format('YYYY-MM-DD');

    if (!state.startDate) {
      notifyInfo('Veuillez sélectionnez une date de débuit');
    } else if (!state.endDate) {
      notifyInfo('Veuillez sélectionnez une date de fin');
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
            item.caisse === var2 &&
            typeof item.caisse !== 'undefined'
          );
        } else if (var2 === 'Tous') {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.client === var1 &&
            typeof item.client !== 'undefined'
          );
        } else {
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.client === var1 &&
            item.caisse === var2 &&
            typeof item.client !== 'undefined' &&
            typeof item.caisse !== 'undefined'
          );
        }
      });
      setFilteredVente(filteredArray);
      if (filteredArray.length == 0) {
        notify('Pas de données');
      } else {
        notifyAdd('Valider');
      }
      console.log('[#######]', filteredArray);
    }
  };
  const createExcelFileJournal = async (dataItems, db) => {
    if (filteredJournal.length == 0) {
      notify('Aucune donnée sélectionnée');
    } else {
      let headCSV = ['Date', 'Libellé', 'Entre', 'Sortie', 'Solde'];
      let array = new Array(headCSV);
      dataItems.forEach(element => {
        function clean(obj) {
          for (var key in obj) {
            if (key === 'id') {
              delete obj[key];
            }
            if (key === 'articles') {
              delete obj[key];
            }
            // if (key === "montantArendre") {
            //   delete obj[key];
            // }
            if (key === 'user') {
              delete obj[key];
            }
          }
          return obj;
        }
        const cleanArray = clean(element);
        const myArray = new Array();
        myArray.splice(0, 0, cleanArray.timeStamp);
        myArray.splice(1, 0, cleanArray.libelle || cleanArray.caisse);
        myArray.splice(2, 0, cleanArray.entre || null);
        myArray.splice(3, 0, parseInt(cleanArray.sortie) || null);
        myArray.splice(4, 0, parseInt(cleanArray.solde));
        array.push(myArray);
        // console.log(array);
      });
      console.log(array);
      notifyAdd('Exportation...');
      await ExcelConverter(array, 'Le journal.xlsx');
    }
  };
  const createExcelFileVente = async (dataItems, db) => {
    if (filteredVente.length == 0) {
      notify('Aucune donnée sélectionnée');
    } else {
      let headCSV = [
        'Date',
        'Client',
        'Caisse',
        'Montant total',
        'Montant réglé',
      ];
      let array = new Array(headCSV);

      dataItems.forEach(element => {
        function clean(obj) {
          for (var key in obj) {
            if (key === 'id') {
              delete obj[key];
            }
            if (key === 'articles') {
              delete obj[key];
            }
            // if (key === "montantArendre") {
            //   delete obj[key];
            // }
            if (key === 'user') {
              delete obj[key];
            }
          }
          return obj;
        }
        const cleanArray = clean(element);
        const myArray = new Array();

        myArray.splice(0, 0, cleanArray.timeStamp);
        myArray.splice(1, 0, cleanArray.client);
        myArray.splice(2, 0, cleanArray.caisse);
        myArray.splice(3, 0, cleanArray.total);
        myArray.splice(4, 0, parseInt(cleanArray.montantRegle));

        array.push(myArray);

        // console.log(array);
      });
      console.log(array);
      notifyAdd('Exportation...');
      await ExcelConverter(array, 'Liste des ventes.xlsx');
    }
  };
  const TableJournal = () => {
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
            <ModalOperation
              modalTitle={'Afficher'}
              onClick={() => filterJournalData()}
              loading={loading}
              error={error}
              showModal={showModalFilterJournal}
              toggleModal={toggleModalFilterJournal}
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
                              filterJournalData();
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
                              filterJournalData();
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  {/* <Col md="12">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative" >
                        <select required id={"intituleCaisse"} className="caisse"
                          onChange={e => {
                            setState({ ...state, caisseSelect: e.target.value }) &&
                            filterVenteData();
                          }}>
                          <option selected="selected" disabled hidden>Caisse</option>
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
            </ModalOperation>
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
                    <h3 className="mb-0">Le journal</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col" /> */}
                    <th scope="col">Date </th>
                    <th scope="col">Libellé </th>
                    <th scope="col">Entrée</th>
                    <th scope="col">Sortie </th>
                    <th scope="col">Solde</th>
                    {/* <th scope="col">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((items, index) => (
                    <tr>
                      {/* <td>
                          <i className="ni ni-credit-card" />
                        </td> */}
                      <td>{items.timeStamp}</td>
                      <td>{items.caisse || items.libelle}</td>
                      <td>{FormatNumber(items.entre)}</td>
                      <td>{FormatNumber(items.sortie)}</td>
                      <td>{FormatNumber(items.solde)} F</td>
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
  const TableVente = () => {
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
                  {'Voullez-vous supprimer cet élément ?'}
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
            <ModalOperation
              modalTitle={'Afficher'}
              onClick={filterVenteData}
              loading={loading}
              error={error}
              showModal={showModalFilterVente}
              toggleModal={toggleModalFilterVente}
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
                            setState({ ...state, startDate: e });
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
                          onChange={e => setState({ ...state, endDate: e })}
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
                          id={'intituleCaisse'}
                          className="caisse"
                          onChange={e => {
                            setState({ ...state, personne: e.target.value }) &&
                              filterVenteData();
                          }}
                        >
                          <option selected="selected" disabled hidden>
                            Client
                          </option>
                          <option value={'Tous'} label={'Tous'}></option>
                          {client?.map((items, index) => (
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
                            setState({ ...state, caisseSelect: e.target.value }) &&
                            filterVenteData();
                          }}>
                          <option selected="selected" disabled hidden>Caisse</option>
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
            </ModalOperation>
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
                    <h3 className="mb-0">Les ventes</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col" /> */}
                    <th scope="col">Date </th>
                    <th scope="col">Libellé </th>
                    <th scope="col">Client </th>
                    <th scope="col">Caisse </th>
                    <th scope="col">Montant</th>
                    {/* <th scope="col">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentItemsVente.map((items, index) => (
                    <tr>
                      {/* <td>
                          <i className="ni ni-credit-card" />
                        </td> */}
                      <td>{items.timeStamp}</td>
                      <td>{'Vente'}</td>
                      <td>{items.client}</td>
                      <td>{items.caisse}</td>
                      <td>{FormatNumber(items.total)} CFA</td>
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
                    <PaginationItem disabled={currentPageVente === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handleClickVente(currentPageVente - 1)}
                      />
                    </PaginationItem>
                    {[...Array(totalPagesVente)].map((_, i) => (
                      <PaginationItem
                        key={i}
                        active={i + 1 === currentPageVente}
                      >
                        <PaginationLink onClick={() => handleClickVente(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={currentPageVente === totalPagesVente}
                    >
                      <PaginationLink
                        next
                        onClick={() => handleClickVente(currentPageVente + 1)}
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
                          selectedButton == 'Vente'
                            ? 'button_mouvenemt_selected left mr-0'
                            : 'button_mouvenemt_ left mr-0'
                        }
                        onClick={() => setSelectedButton('Vente')}
                      >
                        <span color="#000">Vente</span>
                      </div>
                      <div
                        className={
                          selectedButton == 'Journal'
                            ? 'button_mouvenemt_selected right ml-0'
                            : 'button_mouvenemt_ right ml-0'
                        }
                        onClick={() => setSelectedButton('Journal')}
                      >
                        <span>Journal</span>
                      </div>
                    </div>
                    {selectedButton == 'Journal' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          height: '92%',
                        }}
                      >
                        <span>Le journal</span>
                        <img
                          alt="..."
                          width={'80%'}
                          height={'50%'}
                          src={require('./journal.png')}
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
                        <span>Les ventes</span>
                        <img
                          alt="..."
                          width={'55%'}
                          height={'40%'}
                          src={require('./vente.png')}
                        />
                      </div>
                    )}
                  </div>
                  {selectedButton == 'Journal' ? (
                    <div className="div_card_right_">
                      <div className="" style={{ display: 'flex' }}>
                        <ButtonRS
                          className="button_mouvenemt_ left mr-0"
                          onClick={toggleModalFilterJournal}
                        >
                          <span>Afficher</span>
                        </ButtonRS>
                        <ButtonRS
                          className="button_mouvenemt_ right ml-0"
                          onClick={() =>
                            createExcelFileJournal(filteredJournal, 'journal')
                          }
                          // onClick={() => setShowModalFilterJournal(true)}
                        >
                          <span color="#000">Exporter en Excel</span>
                        </ButtonRS>
                      </div>
                      <div style={{ borderRadius: 18 }}>
                        {/* <TableJournal 
                          showModal={showModal} 
                          toggleModal={toggleModal}
                        /> */}
                        {TableJournal()}
                      </div>
                    </div>
                  ) : (
                    <div className="div_card_right_">
                      <div className="" style={{ display: 'flex' }}>
                        <ButtonRS
                          className="button_mouvenemt_ left mr-0"
                          onClick={toggleModalFilterVente}
                        >
                          <span>Afficher</span>
                        </ButtonRS>
                        <ButtonRS
                          className="button_mouvenemt_ right ml-0"
                          onClick={() =>
                            createExcelFileVente(filteredVente, 'vente')
                          }
                        >
                          <span color="#000">Exporter en Excel</span>
                        </ButtonRS>
                      </div>
                      <div>
                        {/* <TableVente 
                          // showModal={showModal} 
                          // toggleModal={toggleModal} 
                        /> */}
                        {TableVente()}
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

export default Rapports;
