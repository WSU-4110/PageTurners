import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDoc,setDoc, getDocs, addDoc, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAt-SInlPaL2FzwtXrRltIEiV5l8k5HMjg",
    authDomain: "pageturners-a831a.firebaseapp.com",
    projectId: "pageturners-a831a",
    storageBucket: "pageturners-a831a.appspot.com",
    messagingSenderId: "304224952392",
    appId: "1:304224952392:web:f33dbc84b481e39a44787d",
    measurementId: "G-C6DKQSJ1R8"
};

initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


async function getClubdocRefFromQParams(queryParams)
{
  let docRef = doc(db,"BookClubs",queryParams.get("id"));
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
  return docSnap;
}

const queryParams = new URLSearchParams(window.location.search);

const docRef = await getClubdocRefFromQParams(queryParams);

document.getElementById("inviteCode").textContent = docRef.data()["JoinCode"];

document.getElementById("inviteLink").setAttribute("href","html/join?jc=" + docRef.data()["JoinCode"])
document.getElementById("inviteLink").textContent = "html.join?jc=" + docRef.data()["JoinCode"]