import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, collection, getDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
  import { getAuth, 
    createUserWithEmailAndPassword,
signOut,
signInWithEmailAndPassword,
onAuthStateChanged
 } 

from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAt-SInlPaL2FzwtXrRltIEiV5l8k5HMjg",
    authDomain: "pageturners-a831a.firebaseapp.com",
    projectId: "pageturners-a831a",
    storageBucket: "pageturners-a831a.appspot.com",
    messagingSenderId: "304224952392",
    appId: "1:304224952392:web:f33dbc84b481e39a44787d",
    measurementId: "G-C6DKQSJ1R8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();
  const db = getFirestore(app);

  const queryParams = new URLSearchParams(window.location.search);

  const name = queryParams.get("name");


  async function getClubDocFromQParams(queryParams)
  {
    const q = query(collection(db, "BookClubs"), where("BookClubName", "==", queryParams.get("name")));
    const qsnap = await getDocs(q);

    
    const docData = qsnap.docs[0].data();
    console.log(docData)
    console.log(docData["BookClubName"]);
    return docData;
  }

  async function getEmailFromUID(uid)
  {
    const q = query(collection(db, "Users"), where("uid", "==", uid));
    const qsnap = await getDocs(q);

    return qsnap.docs[0].data()["email"];
  }

  let docData = await getClubDocFromQParams(queryParams);

  document.getElementById("clubName").textContent = docData["BookClubName"]
  document.getElementById("clubDescription").textContent = docData["clubDescription"]

  for (const uid of docData["ClubUsers"])
  {
    const newLI = document.createElement("li");
    newLI.textContent = await getEmailFromUID(uid);

    const parentUL = document.getElementById("members");
    parentUL.appendChild(newLI);
  }


