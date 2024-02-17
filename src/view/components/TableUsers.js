import { AuthContext } from '../../context/AuthContext';
import { deleteDoc, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
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
  Container,
  Row,
  UncontrolledTooltip,
  Form,
  Col,
  FormGroup,
  InputGroup,
  Input,
  InputGroupText,
  InputGroupAddon,
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

const TableUsers = props => {
  const {  users, caisse } = useContext(AuthContext);

  const notify = message => toast.warn(message);
  const notifyDelete = message => toast.success(message);
  const notifyAdd = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [onChange, setOnChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = users;
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
  const HandleAdd = async e => {
    console.log(data);
    if (data) {
      setLoading(true);
      await uploadData();
    } else {
      notify('Erreur de données');
    }
  };

  async function uploadData() {
    try {
      updateDoc(doc(db, 'users', data.uid), {
        ...data,
        updateTime: moment(new Date()).format('LLL'),
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
  }
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleNo = () => {
    setOpen(false);
  };
  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'users', id));
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
            modalTitle={'Modifier utilisateur'}
            onClick={HandleAdd}
            loading={loading}
            showModal={showModal}
            error={error}
            toggleModal={toggleModal}
            onChange={onChange}
          >
            <Form>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <Input
                        id="nom"
                        value={data.nom}
                        disabled={loading}
                        placeholder="Nom"
                        type="text"
                        onChange={handleInput}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <Input
                        id="prenoms"
                        value={data.prenoms}
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
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <Input
                        id="username"
                        value={data.username}
                        disabled={loading}
                        placeholder="Nom d'utilisateur"
                        type="text"
                        onChange={handleInput}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="email"
                        value={data.email}
                        disabled={loading}
                        placeholder="exemple@gmail.com"
                        type="text"
                        onChange={handleInput}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <select required id={'fonction'} onChange={handleInput}>
                        <option selected="selected" disabled hidden>
                          {data.fonction}
                        </option>
                        <option value="Caissier" label="Caissier" />
                        <option value="Administrateur" label="Administrateur" />
                      </select>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="mb-4 input-group-alternative">
                      <select
                        disabled={data.fonction == 'Administrateur'}
                        id={'caisse'}
                        className="intituleFamille"
                        onChange={handleInput}
                      >
                        <option selected="selected" disabled hidden>
                          {data.caisse || 'Caisse'}
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
              <Row>
                <Col md="12">
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="password"
                        value={data.password}
                        disabled={loading}
                        placeholder="Password"
                        type="password"
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
              <h3 className="mb-0">Liste des utilisateurs</h3>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Prénoms</th>
                  <th scope="col">Nom d'utilisateur</th>
                  <th scope="col">Fonction</th>
                  <th scope="col">Caisse</th>
                  <th scope="col">Email</th>
                  <th scope="col">Date</th>
                  <th scope="col">Mot de passe</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((items, index) => (
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
                            className="rounded-circle"
                            sizes="100%"
                            height={'100%'}
                            width={'100%'}
                            src={
                              items?.photoURL
                                ? items?.photoURL
                                : require('../../assets/img/theme/user.jpg')
                            }
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
                    <td>{items.prenoms}</td>
                    <td>
                      <Badge color="" className="badge-dot">
                        {items.username}
                      </Badge>
                    </td>
                    <td>
                      <Badge color="" className="badge-dot">
                        <i className="bg-success" />
                        {items.fonction}
                      </Badge>
                    </td>
                    <td>{items.caisse}</td>
                    <td>{items.email}</td>
                    <td>{moment(items.timeStamp.toDate()).format('LLL')}</td>
                    <td>{items.password}</td>
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
                          {/* <DropdownItem
                                      href="#pablo"
                                      onClick={(e) => e.preventDefault()}
                                  >
                                      Voir...
                                  </DropdownItem> */}
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

export default TableUsers;
