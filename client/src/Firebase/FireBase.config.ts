
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_apiKey ,
  authDomain:import.meta.env.VITE_authDomain ,
  projectId:import.meta.env.VITE_projectId ,
  storageBucket:import.meta.env.VITE_storageBucket ,
  messagingSenderId:import.meta.env.VITE_messagingSenderId ,
  appId:import.meta.env.VITE_appId ,
};

// const firebaseConfig = {
// apiKey:"AIzaSyAkGo5Vfnxdc2qsJpyPOBIYfXZFQ9uCs1c",
// authDomain:"quick-bus-bd.firebaseapp.com" ,
// projectId:"quick-bus-bd" ,
// storageBucket:"quick-bus-bd.firebasestorage.app" ,
// messagingSenderId:"533454081496" ,
// appId:"1:533454081496:web:1509ca06a35f60634076ad" ,
// };



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;