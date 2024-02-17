import React, { useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';

import { useHistory } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
  } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';

function Form() {
  const [subscriptionKey, setSubscriptionKey] = useState('');
  const [category, setCategory] = useState('administrator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);
  console.log('dispatch check 11111',dispatch)

  const notify = message => toast.error(message);
  const notifyInfo = message => toast.info(message);

  const history = useHistory();

  const handleSubmit = async e => {
    console.log('handlesubmit start');
    if (email?.trim() && password?.trim()) {
      setError('');
      setLoading(true);
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('result check 441 paulin',result)
        // dispatch({ type: 'LOGIN', payload: result.user });
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
            history.push('/admin/index')
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
        <div className="w-3/4 bg-white px-10 py-10 mt-3 mb-5 rounded-3xl border-2 border-gray">
            <Card>
                <CardHeader>
                    <h1
                        className="font-semibold "
                        style={{
                        alignSelf: 'center',
                        fontSize: '25px',
                        fontWeight: 'bold',
                        color: '#2DCE89',
                        }}
                    >
                        Bienvenue sur Wariin
                    </h1>
                    <p className="font-medium text-sm text-gray-500 mt-4">
                        Connecter vous pour continuer.
                    </p>
                </CardHeader>

                <CardBody className="mt-2">
                    <div className="text-center text-muted mb-5">
                        <span style={{ color: 'red', padding: '15px 0', }} className='text description'> {error} </span>
                    </div>
                    <div>
                        {/* <div className="flex items-center space-x-4 justify-center my-5">
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            value="administrator"
                            checked={category === 'administrator'}
                            onChange={() => setCategory('administrator')}
                            className="form-radio h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Administrateur</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            value="client"
                            checked={category === 'client'}
                            onChange={() => setCategory('client')}
                            className="form-radio h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Client</span>
                        </label>
                        </div> */}

                        <div className="">
                        <label htmlFor="email" className="text-lg">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1"
                            placeholder="entrer votre email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>
                        <div className="">
                        <label htmlFor="password" className="text-lg">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="entrer votre password"
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>

                        {/* {category === 'client' && (
                        <div>
                            <label htmlFor="subscriptionKey" className="text-lg">
                            Clé d'Abonnement
                            </label>
                            <input
                            id="subscriptionKey"
                            name="subscriptionKey"
                            type="text"
                            autoComplete="off"
                            required
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 sm:text-sm"
                            placeholder="Clé d'abonnement"
                            onChange={e => setSubscriptionKey(e.target.value)}
                            />
                        </div>
                        )} */}

                        <div className="mt-8 flex justify-between items-center">
                        <div className="">
                            <input type="checkbox" id="remember" />
                            <label className="ml-2 font-medium text-sm" htmlFor="remember">
                            Se souvenir de moi
                            </label>
                        </div>
                        <button className="font-medium text-sm text-violet-500">
                            Mot de passe oublié
                        </button>
                        </div>
                        <div className="mt-8 flex flex-col gap-y-4">
                        <button
                            onClick={() => handleSubmit()}
                            className="transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-600 text-white text-lg font-bold"
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                        </div>
                    </div>
                </CardBody>

            </Card>
        </div>
        </>
  );
}

export default Form;
