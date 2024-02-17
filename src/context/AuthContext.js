import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("currentUser"))
};
export const AuthContext = createContext(INITIAL_STATE); 

export const AuthContextProvider = ({ children }) => {
  
  const currentDate = moment(new Date(), "DD MMMM YYYY HH:mm").format("YYYY-MM-DD");

  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [user, setUser] = useState({});
  const [entreprise, setEntreprise] = useState({});
  const [users, setUsers] = useState([]);
  const [caisse, setCaisse] = useState([]);
  const [article, setArticle] = useState([]);
  const [famille, setFamille] = useState([]);
  const [depense, setDepense] = useState([]);
  const [encaissement, setEncaissement] = useState([]);
  const [client, setClient] = useState([]);
  const [caisseSize, setCaisseSize] = useState(0);
  const [vente, setVente] = useState([]);
  const [articleSize, setArticleSize] = useState(0);
  const [familleSize, setFamilleSize] = useState(0);
  const [usersSize, setUsersSize] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [depenseJours, setDepenseJours] = useState(0);
  const [solde, setSolde] = useState(0);
  const [venteTotal, setVenteTotal] = useState(0);
  const [venteJours, setVenteJours] = useState(0);
  const [nbreventeJours, setNbreventeJours] = useState(0);
  const [month, setMonth] = useState({
    janv: 0,
    fevr: 0,
    mars: 0,
    avr: 0,
    mai: 0,
    juin: 0,
    juill: 0,
    aout: 0,
    sept: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user))
    });
    return () => {
      unsub();
    };
  }, []);
  useEffect(() => {
    // const data = JSON.parse(localStorage.getItem("user"));
    // console.log('data***********', state.currentUser);
    // setUser(data);
    if(state.currentUser?.uid) {
      const unsub = onSnapshot(doc(db, "users", state.currentUser?.uid), (doc) => {
        setUser(doc.data())
      });  
      return () => unsub();
    }
  }, []);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "entreprise", "YYKpHgT8j9DLMPPabqf3"), (doc) => {
      setEntreprise(doc.data())
    });  
    return () => unsub();
  }, []);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "solde", 'vHCXXnbA9SUwNd28yr3d'), (doc) => {
      setSolde(doc.data()?.solde)
      console.log('context solde', doc.data().solde);
    });  
    return () => unsub();
  }, []);

  useEffect(() => {
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
        });
      setUsers(list)
      setUsersSize(list.length)
      });
    return () => unsub();
  }, []);
  useEffect(() => {
    const userRef = collection(db, "caisse");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
        });
      setCaisse(list)
      setCaisseSize(list.length)
      });
    return () => unsub();
  }, []);
  useEffect(() => {
    const userRef = collection(db, "article");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
        });
      setArticle(list)
      setArticleSize(list.length)
      });
    return () => unsub();
  }, []);
  useEffect(() => {
    const userRef = collection(db, "famille");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
        });
      setFamille(list)
      setFamilleSize(list.length)
      });
    return () => unsub();
  }, []);
  useEffect(() => {
    const userRef = collection(db, "client");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
        });
      setClient(list)
      });
    return () => unsub();
  }, []);
  useEffect(() => {
    let montant = 0;
    let montantJours = 0;
    const userRef = collection(db, "depense");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
          montant = montant + parseInt(doc.data().montant);
          const date = moment(doc.data().timeStamp, "DD MMMM YYYY HH:mm").format("YYYY-MM-DD");
          if(date == currentDate){
            montantJours = montantJours + parseInt(doc.data().montant);
          }
        });
      setDepense(list);
      setDepenseTotal(montant);
      setDepenseJours(montantJours);
      montant = 0;
      montantJours = 0;
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    let montant = 0;
    let montantJours = 0;
    const userRef = collection(db, "encaissement");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
        });
      setEncaissement(list);
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    let montant = 0;
    let montantJours = 0;
    let nbreventeJ = 0;
    let janv = 0;
    let fevr = 0;
    let mars = 0;
    let avr = 0;
    let mai = 0;
    let juin = 0;
    let juill = 0;
    let aout = 0;
    let sept = 0;
    let oct = 0;
    let nov = 0;
    let dec = 0;
    
    const userRef = collection(db, "vente");
    const q = query(userRef, orderBy("timeStamp", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data()});
          montant = montant + parseInt(doc.data().total);
          const date = moment(doc.data().timeStamp, "DD MMMM YYYY HH:mm").format("YYYY-MM-DD");
          if(date == currentDate){
            montantJours = montantJours + parseInt(doc.data().total);
            for (let index = 0; index < doc.data().articles.length; index++) {
              nbreventeJ = nbreventeJ + 1;
              console.log(nbreventeJ);
            }
          }
          switch (moment(doc.data().timeStamp, "DD MMMM YYYY HH:mm").format("MMMM")) {
            case 'janvier':
              janv += 1
              break;
            case 'février':
              fevr += 1
              break;
            case 'mars':
              mars += 1
              break;
            case 'avril':
              avr += 1
              break;
            case 'mai':
              mai += 1
              break;
            case 'juin':
              juin += 1
              break;
            case 'juillet':
              juill += 1
              break;
            case 'août':
              aout += 1
              break;
            case 'septembre':
              sept += 1
              break;
            case 'octobre':
              oct += 1
              break;
            case 'novembre':
              nov += 1
              break;
            case 'décembre':
              dec += 1
              break;
            default:
              break;
          }
        });
      setVente(list);
      setVenteTotal(montant);
      setVenteJours(montantJours);
      setNbreventeJours(nbreventeJ);
      setMonth({...month, 
        janv: janv,
        fevr: fevr,
        mars: mars,
        avr: avr,
        mai: mai,
        juin: juin,
        juill: juill,
        aout: aout,
        sept: sept,
        oct: oct,
        nov: nov,
        dec: dec,
      })
      montant = 0;
      montantJours = 0;
      nbreventeJ = 0;
      });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser : state.currentUser, 
        dispatch,
        // user: JSON.parse(localStorage.getItem("user")),
        user: user,
        users: users,
        entreprise: entreprise,
        article: article,
        caisse: caisse,
        depense: depense,
        encaissement: encaissement,
        client: client,
        depenseTotal: depenseTotal,
        depenseJours: depenseJours,
        vente: vente,
        venteTotal: venteTotal,
        venteJours: venteJours,
        nbreventeJours: nbreventeJours,
        solde: solde,
        famille: famille,
        usersSize: usersSize,
        caisseSize: caisseSize,
        familleSize: familleSize,
        articleSize: articleSize,
        month: month,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};