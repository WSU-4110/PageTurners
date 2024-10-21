import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
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

const clubCreateForm = document.querySelector("#createClubForm");

clubCreateForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const clubName = clubCreateForm["clubName"].value;

    let bookClubsRef = collection(db, "BookClubs");
    const q = query(bookClubsRef, where("BookClubName", "==", clubName));
    const qsnap = await getDocs(q)



    if (qsnap.empty){
        addDoc(collection(db,"BookClubs"), {
            BookClubName: clubName
        })
    }
    else{
        alert("Club Name Allready Exists")
    }
    


})