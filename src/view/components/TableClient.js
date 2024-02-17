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
  InputGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Button as ButtonRS,
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
import { ToastContainer, toast } from 'react-toastify';
import {
  collection,
  deleteDoc,
  doc,
  Timestamp,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import InputModal from './InputModal';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

const TableClient = () => {
  const { client } = useContext(AuthContext);

  const notify = message => toast.warn(message);
  const notifyDelete = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const notifyAdd = message => toast.success(message);
  const notifyInfo = message => toast.info(message);
  const [data, setData] = useState({});
  const [updateData, setUpdateData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [clients, setClients] = useState({});

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = client;
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

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const toggleModalUpdate = () => {
    setShowModalUpdate(!showModalUpdate);
  };
  const handleNo = () => {
    setOpen(false);
  };
  const handleInput = e => {
    const id = e.target.id;
    const value = e.target.value;
    setClients({ ...clients, [id]: value });
    setUpdateData({ ...updateData, [id]: value });
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
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const ref = doc(db, 'client', updateData.id);
      await updateDoc(ref, {
        nom: updateData.nom,
        prenoms: updateData.prenoms,
        updateTime: Timestamp.fromDate(new Date()),
        adresse: updateData.adresse,
        number: updateData.number,
      }).then(() => {
        notifyAdd('Modifier avec succès');
        setLoading(false);
      });
    } catch (error) {
      notify('Erreur');
    }
  };

  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'client', id));
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
                {'Voullez-vous supprimer ce client ?'}
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
            // updateData={updateData}
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
          <InputModal
            modalTitle={'Modifier client'}
            onClick={handleUpdate}
            updateData={updateData}
            loading={loading}
            error={error}
            showModal={showModalUpdate}
            toggleModal={toggleModalUpdate}
          >
            <Form>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <Input
                        id="nom"
                        value={updateData?.nom}
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
                        value={updateData?.prenoms}
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
                        value={updateData?.adresse}
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
                        value={updateData?.number}
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
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row>
                <Col md="10">
                  <h3 className="mb-0">Les clients</h3>
                </Col>
                <Col md="2">
                  <ButtonRS
                    block
                    className="mb-0"
                    color="info"
                    type="button"
                    onClick={() => setShowModal(true)}
                    style={{
                      background: '#2DCE89',
                      color: '#fff',
                      borderColor: '#2DCE89',
                    }}
                  >
                    Ajouter
                  </ButtonRS>
                </Col>
              </Row>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  {/* <th scope="col"/> */}
                  <th scope="col">Nom </th>
                  <th scope="col">Prénoms </th>
                  <th scope="col">Adresse </th>
                  <th scope="col">Téléphone</th>
                  <th scope="col">Date </th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((items, index) => (
                  <tr>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar avatar-sm mr-2"
                          href="#pablo"
                          id={'b' + items.id}
                          onClick={e => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            height={'100%'}
                            width={'100%'}
                            className="rounded-circle"
                            src={require('../../assets/img/theme/user.jpg')}
                          />
                        </a>
                        <UncontrolledTooltip delay={0} target={'b' + items.id}>
                          {`${items.nom} ${items.prenoms}`}
                        </UncontrolledTooltip>
                        <Media>
                          <span className="mb-0 text-sm">{items.nom}</span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>{items.nom}</td> */}
                    <td>{items.prenoms}</td>
                    <td>{items.adresse}</td>
                    <td>{items.number}</td>
                    <td>{items.timeStamp}</td>
                    <td className="align-items-center">
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
                              // setOnChange(false);
                              setShowModalUpdate(true);
                              setUpdateData(items);
                            }}
                          >
                            <i className="ni ni-fat-add text-info" />
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            // href="#pablo"
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

export default TableClient;
