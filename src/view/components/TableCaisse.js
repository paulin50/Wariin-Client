import { AuthContext } from '../../context/AuthContext';
import React, { useContext, useState } from 'react';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  deleteDoc,
  query,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
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
  Container,
  Row,
  UncontrolledTooltip,
  Form,
  Col,
  FormGroup,
  InputGroup,
  Input,
} from 'reactstrap';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/fr';
import Modalupdate from './Modalupdate';
moment.locale('fr');

const TableCaisse = () => {
  const { currentUser, caisse } = useContext(AuthContext);

  const notify = message => toast.error(message);
  const notifyDelete = message => toast.success(message);
  const notifyAdd = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [onChange, setOnChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = caisse;
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

  const handleInput = e => {
    setOnChange(true);
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (data.codeCaisse?.trim() && data.intituleCaisse?.trim()) {
      setError('');
      setLoading(true);
      console.log(data);
      try {
        await updateDoc(doc(db, 'caisse', data.id), {
          ...data,
          timeStamp: moment(new Date()).format('LLL'),
        }).then(() => {
          notifyAdd('Modifier avec succes');
          setLoading(false);
          setData({});
        });
      } catch (err) {
        console.log('######', err);
        notify('Erreur, Réessayer');
        setLoading(false);
      }
    } else {
      notify('Veuillez remplir les deux champs !');
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleNo = () => {
    setOpen(false);
  };
  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'caisse', id));
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
          <Modalupdate
            modalTitle={'Modifier caisse'}
            onClick={handleUpdate}
            loading={loading}
            showModal={showModal}
            error={error}
            toggleModal={toggleModal}
            onChange={onChange}
          >
            <Form>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <Input
                        id="codeCaisse"
                        value={data.codeCaisse}
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
                        value={data.intituleCaisse}
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
          </Modalupdate>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Caisses</h3>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  {/* <th scope="col"/> */}
                  <th scope="col">Code caisse </th>
                  <th scope="col">Intitulé caisse </th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((items, index) => (
                  <tr>
                    {/* <td>
                        <i className="ni ni-credit-card" />
                      </td> */}
                    <td>
                      <span className="">{items.codeCaisse}</span>
                    </td>
                    <td>{items.intituleCaisse}</td>
                    <td>{items.timeStamp}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className="btn-icon-only text-light"
                          href="#pablo"
                          role="button"
                          size="sm"
                          color=""
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                          <DropdownItem
                            // href="#pablo"
                            onClick={() => {
                              setOnChange(false);
                              toggleModal();
                              setData(items);
                            }}
                          >
                            <i className="ni ni-fat-add text-info" />
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            href="#pablo"
                            onClick={e => {
                              setDeleteId(items.id);
                              setOpen(true);
                            }}
                          >
                            <i className="ni ni-fat-remove text-red" />
                            Supprimer
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
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
          </Card>
        </div>
      </Row>
    </>
  );
};

export default TableCaisse;
