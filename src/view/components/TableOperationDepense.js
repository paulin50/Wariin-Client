import React, { useContext, useEffect, useState } from 'react';
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
  Input,
  InputGroup,
  FormGroup,
  Form,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';
import ReactDatetime from 'react-datetime';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
import ExcelConverter from './ExcelFile';
import moment from 'moment';
import 'moment/locale/fr';
import ModalOperation from './ModalOperation';
import FormatNumber from 'Converter/Convert';
moment.locale('fr');

const TableOperationDepense = props => {
  const { currentUser, depense, caisse, users } = useContext(AuthContext);

  const notify = message => toast.error(message);
  const notifyDelete = message => toast.success(message);
  const notifySuccess = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const notifyInfo = message => toast.info(message);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowmodal] = useState(false);
  const [filteredDepense, setFilteredDepense] = useState([]);
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    personne: '',
    caisseSelect: '',
  });

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = filteredDepense;
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
    const data = props.data;
    let var1 = state.personne;
    let var2 = state.caisseSelect;
    let startDate = moment(state.startDate).format('YYYY-MM-DD');
    let endDate = moment(state.endDate).format('YYYY-MM-DD');
    console.log('********', var1, var2);

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
        notifyInfo('Pas de données');
      }
      console.log('[#######]', filteredArray);
    }
  };

  const toggleModal = () => {
    setShowmodal(!showModal);
  };

  const handleInput = e => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
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

  const createExcelFile = async data => {
    let headCSV = ['Date', 'Libellé', 'Initiateur', 'Caisse', 'Montant'];
    let array = new Array(headCSV);
    data.forEach(element => {
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
    await ExcelConverter(array, 'Liste des dépenses.xlsx');
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
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <select
                        required
                        id={'intituleCaisse'}
                        className="caisse"
                        onChange={e => {
                          setState({ ...state, personne: e.target.value });
                          filterData();
                        }}
                      >
                        <option selected="selected" disabled hidden>
                          Personne
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
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <select
                        required
                        id={'intituleCaisse'}
                        className="caisse"
                        onChange={e => {
                          setState({ ...state, caisseSelect: e.target.value });
                          filterData();
                        }}
                      >
                        <option selected="selected" disabled hidden>
                          Caisse
                        </option>
                        <option value={'Tous'} label={'Tous'}></option>
                        {caisse?.map((items, index) => (
                          <option
                            key={index}
                            value={items.intituleCaisse}
                            label={items.intituleCaisse}
                          />
                        ))}
                      </select>
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
                    disabled={filteredDepense.length == 0}
                    color="red"
                    type="button"
                    style={{
                      boxShadow: 'none',
                      borderRadius: '4px',
                      background: `${
                        filteredDepense.length > 0 ? '#F96131' : '#EAEAEA'
                      }`,
                      color: `${filteredDepense.length > 0 ? '#fff' : '#000'}`,
                      borderColor: `${
                        filteredDepense.length > 0 ? '#F96131' : '#EAEAEA'
                      }`,
                      pointerEvents: `${
                        filteredDepense.length > 0 ? 'painted' : 'none'
                      }`,
                    }}
                    onClick={() => {
                      setFilteredDepense([]);
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
                    style={{
                      background: '#fff',
                      boxShadow: 'none',
                      color: '#32D689',
                      borderColor: '#32D689',
                      pointerEvents: 'painted',
                    }}
                    onClick={() => setShowmodal(true)}
                  >
                    Afficher
                  </ButtonRS>
                </Col>
                <Col md="2">
                  <ButtonRS
                    block
                    className="mb-0 mt-2"
                    disabled={filteredDepense.length == 0}
                    color="info"
                    type="button"
                    style={{
                      boxShadow: 'none',
                      background: `${
                        filteredDepense.length > 0 ? '#2DCE89' : '#CCEED3'
                      }`,
                      color: `${filteredDepense.length > 0 ? '#fff' : '#000'}`,
                      borderColor: '#CCEED3',
                      pointerEvents: `${
                        filteredDepense.length > 0 ? 'painted' : 'none'
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
            {filteredDepense.length > 0 ? (
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" />
                    <th scope="col">Date </th>
                    <th scope="col">Libellé </th>
                    <th scope="col">Initiateur </th>
                    <th scope="col">Caisse </th>
                    <th scope="col">Montant</th>
                    {/* <th scope="col">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((items, index) => (
                    <tr>
                      <td>
                        <i className="ni ni-credit-card" />
                      </td>
                      <td>{items.timeStamp}</td>
                      <td>{items.libelle || items.intituleArticle}</td>
                      <td>{items.initiateur}</td>
                      <td>{items.intituleCaisse}</td>
                      <td>
                        {FormatNumber(items.montant) ||
                          FormatNumber(items.prix)}{' '}
                        CFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : null}
            {filteredDepense.length > 0 ? (
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
            ) : null}
          </Card>
        </div>
      </Row>
    </>
  );
};

export default TableOperationDepense;
