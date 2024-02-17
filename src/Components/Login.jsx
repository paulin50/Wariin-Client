// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useContext, useEffect, useState } from "react";
// // import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// // import { AuthContext } from "../../context/AuthContext";
// // import { auth, db } from '../../firebase';
// import { useHistory } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [subscriptionKey, setSubscriptionKey] = useState("");
//   const [category, setCategory] = useState("administrator");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

// //   const { dispatch } = useContext(AuthContext);

//   const notify = (message) => toast.error(message);
//   const notifyInfo = (message) => toast.info(message);

//   useEffect(() => {
//     // signOut(auth);
//   }, []);

//   const history = useHistory();

//   const handleSubmit = async () => {
//     if (email?.trim() && password?.trim()) {
//       setError("");
//       setLoading(true);
//       try {
//         const result = await signInWithEmailAndPassword(auth, email, password);
//         dispatch({ type: "LOGIN", payload: result.user });
//         const docSnap = await getDoc(doc(db, "users", result.user.uid));

//         if (docSnap.exists()) {
//           try {
//             localStorage.setItem("user", JSON.stringify(docSnap.data()));
//           } catch (error) {
//             console.log("Error:", error);
//           }
//         }

//         history.push('/admin/index');
//       } catch (err) {
//         setLoading(false);
//         const errorCode = err.code;
//         switch (errorCode) {
//           case 'auth/user-not-found':
//             setError('Cet utilisateur n\'existe pas');
//             notify("Cet utilisateur n\'existe pas");
//             break;
//           case 'auth/wrong-password':
//             setError('Mot de passe incorrect');
//             notify("Mot de passe incorrect");
//             break;
//           case 'auth/invalid-email':
//             setError('Email invalide');
//             notify("Email invalide");
//             break;
//           case 'auth/network-request-failed':
//             setError('Erreur de connexion');
//             notify("Erreur de connexion");
//             break;
//           case 'auth/too-many-requests':
//             setError('Echec ! Trop de tentatives...');
//             notifyInfo("Echec ! Trop de tentatives...");
//             break;
//           default:
//             setError(err.code);
//             notify("Erreur. Veuillez réessayer");
//             break;
//         }
//       }
//     } else {
//       notifyInfo("Veuillez remplir tous les champs !");
//     }
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-center"
//         autoClose={1500}
//         hideProgressBar
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Connexion</h2>
//             <p className="mt-2 text-center text-sm text-gray-600">Connectez-vous pour continuer</p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
//             <div className="flex items-center space-x-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   value="administrator"
//                   checked={category === "administrator"}
//                   onChange={() => setCategory("administrator")}
//                   className="form-radio h-5 w-5 text-indigo-600"
//                 />
//                 <span className="ml-2 text-gray-700">Administrator</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   value="client"
//                   checked={category === "client"}
//                   onChange={() => setCategory("client")}
//                   className="form-radio h-5 w-5 text-indigo-600"
//                 />
//                 <span className="ml-2 text-gray-700">Client</span>
//               </label>
//             </div>
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Email"
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Mot de passe"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               {category === 'client' && (
//                 <div>
//                   <input
//                     id="subscriptionKey"
//                     name="subscriptionKey"
//                     type="text"
//                     autoComplete="off"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                     placeholder="Clé d'abonnement"
//                     onChange={(e) => setSubscriptionKey(e.target.value)}
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   Se rappeler de moi
//                 </label>
//               </div>
//             </div>
//             <div>
//               <button
//                 type="button"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 // onClick={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? "Connexion en cours..." : "Se connecter"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React from 'react';

import '../Style/Login.css';
import Form from './Form';

const Login = () => {
  return (
    <div className="flex w-full h-screen mt-10">
      <div className="hidden relative lg:flex w-1/2 h-full items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
      </div>
      <div className="w-full h-full flex items-center justify-center lg:w-1/2">
        <Form />
      </div>
    </div>
  );
};

export default Login;
