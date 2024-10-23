import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, collection, getDoc, updateDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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

  async function getClubdocRefFromQParams(queryParams)
  {
    let docRef = doc(db,"BookClubs",queryParams.get("id"));
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    return docSnap;
  }

  const queryParams = new URLSearchParams(window.location.search);

  let docRef = await getClubdocRefFromQParams(queryParams);
  console.log(docRef.id);
  document.getElementById("club-name").placeholder = docRef.data()["BookClubName"];
  document.getElementById("club-description").placeholder = docRef.data()["clubDescription"];

  const clubEditForm = document.getElementById("clubmanage");
  
  clubEditForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const clubName = clubEditForm["club-name"].value;
    let desc = clubEditForm["club-description"].value;

    if (desc == "")
    {
        desc = docRef.data()["clubDescription"];
    }

    

    let bookClubsRef = collection(db, "BookClubs");
    const q = query(bookClubsRef, where("BookClubName", "==", clubName));
    const qsnap = await getDocs(q)



    if (qsnap.empty || clubName == docRef.docs[0].data()["BookClubName"]){
        await updateDoc(doc(db,"BookClubs", docRef.id), {
            BookClubName: clubName,
            clubDescription: desc
        }, clubName)

        window.location.href = "./clubhomepage.html?id=" + docRef.id;

    }
    else{
        alert("Club Name Allready Exists")
    }
    


})