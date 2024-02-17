import React, { useContext, useState } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Button as ButtonRS,
  Container,
  Row,
  UncontrolledTooltip,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Form,
} from 'reactstrap';
import ReactDatetime from 'react-datetime';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Modals from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  deleteDoc,
  query,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../../../context/AuthContext';
import moment from 'moment';
import 'moment/locale/fr';
import { useEffect } from 'react';
import FormatNumber from 'Converter/Convert';
import ExcelConverter from './ExcelFile';
import ModalOperation from './ModalOperation';
moment.locale('fr');

const TableJournal = props => {
  const { currentUser, famille, vente, depense } = useContext(AuthContext);
  let solde = 0;

  const notify = message => toast.info(message);
  const notifyDelete = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [journalTable, setJournalTable] = useState([]);
  const [showModal, setShowmodal] = useState(false);
  const [filteredJournal, setFilteredJournal] = useState([]);
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    tableVente: vente,
    tableDepense: depense,
  });

  const createExcelFile = async data => {
    let headCSV = ['Date', 'Libellé', 'Entre', 'Sortie', 'Solde'];
    let array = new Array(headCSV);

    data.forEach(element => {
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
    await ExcelConverter(array, 'Le journal.xlsx');
  };

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

  const itemsPerPage = 6;
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

  const filterData = () => {
    const data = journalTable;
    console.log(filteredJournal);
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
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredJournal(filteredArray);
      if (filteredArray.length == 0) {
        notify('Pas de données');
      }
      console.log('[#######]', filteredArray);
    }
  };

  const toggleModal = () => {
    setShowmodal(!showModal);
  };
  const handleNo = () => {
    setOpen(false);
  };
  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'famille', id));
      notifyDelete('Supprimer avec succes');
    } catch (error) {
      console.log(error);
    }
  };

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
                  handleDelete(deleteId);
                  setOpen(false);
                }}
              >
                Oui
              </Button>
            </DialogActions>
          </Dialog>
          <ModalOperation
            modalTitle={'Afficher'}
            onClick={filterData}
            loading={loading}
            error={error}
            showModal={showModal}
            toggleModal={toggleModal}
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
            </Form>
          </ModalOperation>
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row>
                <Col md="6">
                  <h3 className="mb-0">{props?.title}</h3>
                </Col>
                <Col md="2">
                  <ButtonRS
                    block
                    className="mb-0 mt-2"
                    disabled={filteredJournal.length == 0}
                    color="red"
                    type="button"
                    style={{
                      boxShadow: 'none',
                      borderRadius: '4px',
                      background: `${
                        filteredJournal.length > 0 ? '#F96131' : '#EAEAEA'
                      }`,
                      color: `${filteredJournal.length > 0 ? '#fff' : '#000'}`,
                      borderColor: `${
                        filteredJournal.length > 0 ? '#F96131' : '#EAEAEA'
                      }`,
                      pointerEvents: `${
                        filteredJournal.length > 0 ? 'painted' : 'none'
                      }`,
                    }}
                    onClick={() => {
                      setFilteredJournal([]);
                    }}
                  >
                    Réinitialiser
                  </ButtonRS>
                </Col>
                <Col md="2">
                  <ButtonRS
                    block
                    className="mb-0 mt-2"
                    color="info"
                    type="button"
                    // onClick={toggleModal}
                    onClick={() => setShowmodal(true)}
                    style={{
                      background: '#fff',
                      borderRadius: '4px',
                      boxShadow: 'none',
                      color: '#32D689',
                      borderColor: '#32D689',
                    }}
                  >
                    Afficher
                  </ButtonRS>
                </Col>
                <Col md="2">
                  <ButtonRS
                    block
                    disabled={filteredJournal.length == 0}
                    className="mb-0 mt-2"
                    color="info"
                    type="button"
                    style={{
                      boxShadow: 'none',
                      borderRadius: '4px',
                      background: `${
                        filteredJournal.length > 0 ? '#2DCE89' : '#CCEED3'
                      }`,
                      color: `${filteredJournal.length > 0 ? '#fff' : '#000'}`,
                      borderColor: '#CCEED3',
                      pointerEvents: `${
                        filteredJournal.length > 0 ? 'painted' : 'none'
                      }`,
                    }}
                    onClick={() => {
                      createExcelFile(currentItems);
                      // console.log(depense);
                    }}
                  >
                    Excel
                  </ButtonRS>
                </Col>
              </Row>
            </CardHeader>
            {filteredJournal.length > 0 ? (
              <div>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" />
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
                        <td>
                          <i className="ni ni-credit-card" />
                        </td>
                        <td>{items.timeStamp}</td>
                        <td>{items.caisse || items.libelle}</td>
                        <td>{FormatNumber(items.entre)}</td>
                        <td>{FormatNumber(items.sortie)}</td>
                        <td>{FormatNumber(items.solde)} F</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
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
              </div>
            ) : null}
          </Card>
        </div>
      </Row>
    </>
  );
};

export default TableJournal;
