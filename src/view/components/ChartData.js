import React, { useEffect } from "react";
import { useState } from "react";

export default Chart = () => {

    const [state, setState] = useState({
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
        // const fetchData = async () => {
        //   let currentDate = new Date();
        //   let date1 = moment(currentDate);
    
        //   let listePraticiens = [];
        //   try {
        //     const querySnapshot = await getDocs(collection(db, "user"));
        //     querySnapshot.forEach((doc) => {
        //       listePraticiens.push({ id: doc.id, ...doc.data()});
        //     });
        //     setTotalPraticiens(listePraticiens.length)
        //     listePraticiens = [];
        //   } catch (error) {
        //     console.log(error);
        //   }
    
        //   let listePatients = [];
        //   try {
        //     const querySnapshot = await getDocs(collection(db, "patients"));
        //     querySnapshot.forEach((doc) => {
        //       listePatients.push({ id: doc.id, ...doc.data()});
        //     });
        //     setTotalPatients(listePatients.length)
        //     listePraticiens = [];
        //   } catch (error) {
        //     console.log(error);
        //   }
    
        //   try {
        //     const q = query(collection(db, "reservations"), where("typeConsultation", "==", "Vidéo"));
        //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //       let listeConsulV = [];
        //       querySnapshot.forEach((doc) => {
        //           listeConsulV.push(doc.data());
        //       });
        //       setTotalConsulV(listeConsulV.length)
        //       listeConsulV = [];
        //     });
        //   } catch (error) {
        //     console.log(error);
        //   }
    
        //   try {
        //     const q = query(collection(db, "reservations"), where("typeConsultation", "==", "Physique"));
        //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //       let listeConsulP = [];
        //       querySnapshot.forEach((doc) => {
        //           listeConsulP.push(doc.data());
        //       });
        //       setTotalConsulP(listeConsulP.length)
        //       listeConsulP = [];
    
        //     });
        //   } catch (error) {
        //     console.log(error);
        //   }
    
        //   try {
        //     const q = query(collection(db, "reservations"));
        //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
              
        //       let past = 0;
        //       let today = 0;
        //       let future = 0;
        //       let total = [];
        //       let janv = 0;
        //       let fevr = 0;
        //       let mars = 0;
        //       let avr = 0;
        //       let mai = 0;
        //       let juin = 0;
        //       let juill = 0;
        //       let aout = 0;
        //       let sept = 0;
        //       let oct = 0;
        //       let nov = 0;
        //       let dec = 0;
        //       querySnapshot.forEach((doc) => {
        //         total.push(doc.data());
        //         if(date1.diff(moment(doc.data().date), 'days') >0) {
        //           past += 1
        //         }
        //         else if(date1.format('l') == moment(doc.data().date).format('l')) {
        //           today += 1
        //         }
        //         else if(date1.diff(doc.data().date, 'days') <= 0) {
        //           future += 1 
        //         }
        //         switch (moment(doc.data().date).format('MMMM')) {
        //           case 'January':
        //             janv += 1
        //             break;
        //           case 'February':
        //             fevr += 1
        //             break;
        //           case 'March':
        //             mars += 1
        //             break;
        //           case 'April':
        //             avr += 1
        //             break;
        //           case 'May':
        //             mai += 1
        //             break;
        //           case 'June':
        //             juin += 1
        //             break;
        //           case 'July':
        //             juill += 1
        //             break;
        //           case 'August':
        //             aout += 1
        //             break;
        //           case 'September':
        //             sept += 1
        //             break;
        //           case 'October':
        //             oct += 1
        //             break;
        //           case 'November':
        //             nov += 1
        //             break;
        //           case 'December':
        //             dec += 1
        //             break;
        //           default:
        //             break;
        //         }
        //         // console.log(moment(doc.data().date).format('MMMM'));
        //       });
        //       setNbPast(past)
        //       setNbToday(today)
        //       setNbFuture(future)
        //       setNbTotal(total.length)
        //       setState({...state, 
        //         janv: janv,
        //         fevr: fevr,
        //         mars: mars,
        //         avr: avr,
        //         mai: mai,
        //         juin: juin,
        //         juill: juill,
        //         aout: aout,
        //         sept: sept,
        //         oct: oct,
        //         nov: nov,
        //         dec: dec,
        //       })
        //     });
        //   } catch (error) {
        //     console.log(error);
        //   }
        // };
        // fetchData();
      }, []);
    
    return(
        <>
        </>
    )
}