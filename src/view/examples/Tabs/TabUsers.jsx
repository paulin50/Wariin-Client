import React, { useContext, useState } from 'react';
import { ImNotification } from 'react-icons/im';
import TableUsers from '../../../view/components/TableUsers';
import Modals from '../../../view/components/Modal';
import {
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, storage } from '../../../firebaseConfig';
import {
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../../context/AuthContext';

function TabUsers(props) {
  const { caisse } = useContext(AuthContext);

  const notifyAdd = message => toast.success(message);
  const notify = message => toast.error(message);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);

  const handleInput = e => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    console.log(data);
  };

  const HandleAdd = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(data);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await setDoc(doc(db, 'users', res.user.uid), {
        ...data,
        timeStamp: Timestamp.fromDate(new Date()),
        uid: res.user.uid,
        photoURL: null,
      }).then(() => {
        notifyAdd('Ajouter avec succes');
        setLoading(false);
        setData({});
      });
    } catch (err) {
      console.log('######', err);
      setLoading(false);

      if (err.code === 'auth/user-not-found') {
        setError("Cet utilisateur n'existe");
        notify("Erreur : Cet utilisateur n'existe");
      } else if (err.code === 'auth/weak-password') {
        setError('Mot de passe trop faible (6 caractères au moins)');
        notify('Erreur : Mot de passe trop faible (6 caractères au moins)');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
        notify('Erreur : Email invalide');
      } else if (err.code === 'auth/email-already-in-use') {
        setError(
          "L'adresse e-mail fournie est déjà utilisée par un utilisateur existant"
        );
        notify(
          "Erreur : L'adresse e-mail fournie est déjà utilisée par un utilisateur existant"
        );
      } else if (err.code === 'auth/internal-error') {
        setError(
          "Le serveur d'authentification a rencontré une erreur inattendue. Veuillez réessayer"
        );
        notify(
          "Erreur : Le serveur d'authentification a rencontré une erreur inattendue. Veuillez réessayer"
        );
      } else if (err.code === 'auth/user-not-found') {
        setError("Cet utilisateur n'existe");
        notify("Erreur : Cet utilisateur n'existe");
      } else {
        setError('Erreur inconnue');
        notify('Erreur : Erreur inconnue');
      }
    }
  };

  return (
    <div>
      {
        <div>
          <div
            style={{
              padding: '18px',
              backgroundColor: 'whitesmoke',
              borderWidth: '1px',
            }}
          >
            {/* <Button color="info" type="button">
              Ajouter un utilisateur
            </Button> */}
            <Modals
              buttonText={'Ajouter'}
              modalTitle={'Ajouter utilisateur'}
              onClick={HandleAdd}
              loading={loading}
              error={error}
              toggleModal={() => {}}
            >
              <Form>
                <Row>
                  <Col md="6">
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
                  <Col md="6">
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
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="mb-4 input-group-alternative">
                        <Input
                          id="username"
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
                            Fonction
                          </option>
                          <option value="Caissier" label="Caissier" />
                          <option
                            value="Administrateur"
                            label="Administrateur"
                          />
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
            </Modals>
          </div>
          <div
            style={{
              height: '560px',
              overflow: 'scroll',
              padding: '18px',
            }}
          >
            <TableUsers toggleModal={props.toggleModal} />
          </div>
        </div>
        // <div style={{ justifyContent: 'center', margin: '25px', display: 'flex',}}>
        //   <ImNotification size={25} color={"blue"} />
        //   <span style={{ padding: '0 5px' }}>Dossiers vide!</span>
        // </div>
      }
    </div>
  );
}

export default TabUsers;
