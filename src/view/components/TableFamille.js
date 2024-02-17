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
  Col,
  Form,
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
import Modals from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import {
  deleteDoc,
  query,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import moment from 'moment';
import 'moment/locale/fr';
import Modalupdate from './Modalupdate';
moment.locale('fr');

const TableFamille = () => {
  const { currentUser, famille } = useContext(AuthContext);

  const notify = message => toast.info(message);
  const notifyDelete = message => toast.success(message);
  const notifyAdd = message => toast.success(message);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [onChange, setOnChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState('');
  const [url, setUrl] = useState('');
  const [perc, setPerc] = useState(null);
  let image = '';

  const itemsPerPage = 6; // Nombre d'éléments à afficher par page
  const [currentPage, setCurrentPage] = useState(1);
  const items = famille;
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
      setError('');
      setLoading(true);
      uploadImage();
    } else {
      notify('Pas de données');
    }
  };
  const uploadImage = async () => {
    if (file) {
      let upload = new Promise((resolve, reject) => {
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setPerc(progress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          error => {
            console.log(error);
            setLoading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              image = downloadURL;
              console.log('url', downloadURL);
              if (downloadURL) resolve();
            });
          }
        );
      });
      upload.then(() => {
        uploadData(image);
      });
    } else {
      uploadData(data.icon);
    }
  };
  async function uploadData(img) {
    try {
      updateDoc(doc(db, 'famille', data.id), {
        ...data,
        updateTime: moment(new Date()).format('LLL'),
        img: img,
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
          <Modalupdate
            modalTitle={'Modifier famille article'}
            onClick={HandleAdd}
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
                        id="codeFamille"
                        value={data.codeFamille}
                        disabled={loading}
                        placeholder="Code famille"
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
                        id="intituleFamille"
                        value={data.intituleFamille}
                        disabled={loading}
                        placeholder="Intitulé du famille"
                        type="text"
                        onChange={handleInput}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      height: '90%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      width: '80%',
                      borderStyle: 'dashed',
                      borderWidth: '2px',
                      borderRadius: '3px',
                      padding: '5px',
                      pointerEvents: 'auto',
                    }}
                  >
                    <label id="label-img" htmlFor="file">
                      Choisir icon:
                      {/* <DriveFolderUploadOutlinedIcon className="icon" /> */}
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={e => setFile(e.target.files[0])}
                      style={{ display: 'none', pointerEvents: 'visible' }}
                    />
                  </div>
                </Col>
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
                      style={{ borderRadius: '8px', background: '#fff' }}
                      height={'90%'}
                      width={'50%'}
                      src={file ? URL.createObjectURL(file) : data.icon}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </Modalupdate>

          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Famille d'article</h3>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col" />
                  <th scope="col">Code famille </th>
                  <th scope="col">Intitulé famille </th>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((items, index) => (
                  <tr>
                    <td>
                      <a
                        className=""
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        <img
                          alt="..."
                          sizes="90px"
                          style={{
                            borderRadius: '8px',
                            background: '#f5f5f5',
                            padding: '5px',
                          }}
                          height={'60px'}
                          width={'60px'}
                          src={items.icon}
                        />
                      </a>
                    </td>
                    <td>
                      <span className="">{items.codeFamille}</span>
                    </td>
                    <td>{items.intituleFamille}</td>
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

export default TableFamille;
