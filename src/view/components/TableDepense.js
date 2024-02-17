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
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
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
} from 'reactstrap';
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
  Timestamp,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import InputModal from './InputModal';
import moment from 'moment';
import 'moment/locale/fr';
import { useEffect } from 'react';
import FormatNumber from 'Converter/Convert';
import Depenses from 'views/examples/Depenses';
moment.locale('fr');

const TableDepense = props => {
  const { currentUser, famille, depense, caisse, user, solde } =
    useContext(AuthContext);

  const notify = message => toast.warn(message);
  const notifyDelete = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const notifyAdd = message => toast.success(message);
  const notifyInfo = message => toast.info(message);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = depense;
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

  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };
  const handleNo = () => {
    setOpen(false);
  };
  const handleInput = e => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };
  const HandleAdd = async e => {
    console.log(data);
    e.preventDefault();
    if (data.libelle?.trim() && data.montant?.trim() && data.intituleCaisse) {
      setError('');
      setLoading(true);
      console.log(data);
      try {
        await addDoc(collection(db, 'depense'), {
          ...data,
          initiateur: user?.nom + ' ' + user?.prenoms,
          initiateurData: user,
          timeStamp: moment(new Date()).format('LLL'),
        }).then(async () => {
          try {
            await updateDoc(doc(db, 'solde', 'vHCXXnbA9SUwNd28yr3d'), {
              solde: parseInt(solde - parseInt(data.montant)),
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
  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'depense', id));
      notifyDelete('Supprimer avec succes');
    } catch (error) {
      console.log(error);
    }
  };

  // Depenses(currentItems);

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
          <InputModal
            modalTitle={'Ajouter un décaissement'}
            onClick={HandleAdd}
            loading={loading}
            error={error}
            showModal={props.showModal}
            toggleModal={props.toggleModal}
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
              <Row>
                <Col md="12">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <select
                        required
                        id={'intituleCaisse'}
                        className="caisse"
                        onChange={handleInput}
                      >
                        <option selected="selected" disabled hidden>
                          Caisse
                        </option>
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
                {/* <Col md='3' >
                  <ButtonRS
                    block
                    className="mb-0"
                    color="info"
                    type="button"
                    onClick={() => setShowModal(true)}
                    style={{background: '#2DCE89', color: "#fff", borderColor: '#2DCE89'}}
                  >
                    Decaisser
                  </ButtonRS>
                </Col> */}
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
                    {/* <td>
                      <i className="ni ni-credit-card" />
                    </td> */}
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

export default TableDepense;
