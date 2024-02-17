import './index.css';
import { toast, ToastContainer } from 'react-toastify';
import { ImNotification } from 'react-icons/im';
import { IoMdClose } from 'react-icons/io';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
// import { AuthContext } from '../../../context/AuthContext';
import { MdMonetizationOn, MdCheckCircle } from 'react-icons/md';
import { FaNotesMedical } from 'react-icons/fa';
import Tab from './Tab';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

export default function Params() {
  const location = useLocation();
  const data = location.state;
  // console.log(data);

  const notifyDelete = message => toast.success(message);

  const [deleteId, setDeleteId] = useState('');
  const [open, setOpen] = useState(false);
  // const { currentUser } = useContext(AuthContext);

  // const [data, setData] = useState(null);
  const [details, setDetails] = useState({});

  // useEffect(() => {
  //     setData(location.state)

  //     const pubRef = collection(db, "patients");
  //     const q = query(pubRef, orderBy("date", "desc"));
  //     const unsub = onSnapshot(pubRef, (querySnapshot) => {
  //         let list = [];
  //         querySnapshot.forEach((doc) => {
  //         list.push({ id: doc.id, ...doc.data()});
  //     });
  //     setData(list);
  //     });

  //     return () => {
  //         unsub();
  //     };
  // }, []);

  useEffect(() => {
    // notifyDelete("En cours...")
    // try {
    //     updateDoc(doc(db, "nombreNotifications", currentUser.uid), {
    //         nbreNotifs: 0,
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
  }, []);

  const handleNo = () => {
    setOpen(false);
  };

  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      notifyDelete('Supprimer avec succes');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#fff',
        height: '100%',
        borderRadius: '12px',
        // overflow: 'scroll',
        // scrollbarWidth: '0px',
      }}
    >
      <Dialog
        open={open}
        keepMounted
        onClose={handleNo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Suppression!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {'Voullez-vous supprimer cette notification ?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Non
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteId);
              setOpen(false);
            }}
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
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
      <div style={{ display: 'flex', width: '100%', borderRadius: '12px' }}>
        <div id="header-profil">
          {/* <hr id="detail-hr" /> */}
          <Tab />
        </div>
      </div>
    </div>
  );
}
