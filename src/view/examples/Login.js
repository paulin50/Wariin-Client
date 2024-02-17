// reactstrap components
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../../../context/AuthContext';
import { auth, db } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const notify = message => toast.error(message);
  const notifyInfo = message => toast.info(message);

  useEffect(() => {
    // signOut(auth);
  }, []);

  const history = useHistory();

  const handleSubmit = async e => {
    console.log('handlesubmit start');
    if (email?.trim() && password?.trim()) {
      setError('');
      setLoading(true);
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        dispatch({ type: 'LOGIN', payload: result.user });
        await getDoc(doc(db, 'users', result.user.uid))
          .then(docSnap => {
            if (docSnap.exists) {
              try {
                localStorage.setItem('user', JSON.stringify(docSnap.data()));
              } catch (error) {
                console.log('er#####', error);
              }
            }
          })
          .then(() => {
            history.push('/admin/index');
          });
      } catch (err) {
        console.log('errrrr', err);
        setLoading(false);
        const errorCode = error.code;
        if (err.code === 'auth/user-not-found') {
          setError("Cet utilisateur n'existe pas");
          notify("Cet utilisateur n'existe pas");
        } else if (err.code === 'auth/wrong-password') {
          setError('Mot de passe incorect');
          notify('Mot de passe incorect');
        } else if (err.code === 'auth/invalid-email') {
          setError('Email invalide');
          notify('Email invalide');
        } else if (err.code === 'auth/network-request-failed') {
          setError('Erreur de connexion');
          notify('Erreur de connexion');
        } else if (err.code === 'auth/too-many-requests') {
          setError('Echec ! Trop de tentatives...');
          notifyInfo('Echec ! Trop de tentatives...');
        } else {
          setError(err.code);
          notify('Erreur. Veuillez réessayer');
        }
      }
    } else {
      notifyInfo('Veuillez remplir tous les champs !');
    }
  };

  return (
    <>
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
      <div className="login-background-image_">
        <Card className="bg-secondary border-0 ">
          <CardHeader className="bg-transparent pb-4">
            <div className="text-muted text-center mt-2 mb-3">
              <span
                className=""
                style={{
                  alignSelf: 'center',
                  fontSize: '25px',
                  fontWeight: 'bold',
                  color: '#2DCE89',
                }}
              >
                Connexion
              </span>
            </div>
            <div className="btn-wrapper text-center">
              <span className="text description">
                Connectez vous pour continuer
              </span>
            </div>
          </CardHeader>

          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-5">
              <span
                style={{ color: 'red', padding: '15px 0' }}
                className="text description"
              >
                {' '}
                {error}{' '}
              </span>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    onChange={e => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    autoComplete="new-password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Se rappeler de moi</span>
                </label>
              </div>
              <Col className="text-center" md="13">
                <Button
                  style={{
                    background: '#2DCE89',
                    color: '#fff',
                    width: '100%',
                    borderColor: '#2DCE89',
                  }}
                  className="my-4"
                  type="button"
                  onClick={() => handleSubmit()}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Login;
