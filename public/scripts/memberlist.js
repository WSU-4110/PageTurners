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





function appendElement (parentID,elemNode,textNode,href) {
    var container = document.getElementById(parentID);
    var element = document.createElement(elemNode);
    var element2 = document.createElement("li");

    element.setAttribute("href",href)
    var text = document.createTextNode("\t" +textNode + "\n");
    element.appendChild(text);
    element2.appendChild(element)
    container.appendChild(element2);
}
async function getClubdocRefFromQParams(queryParams)
{
  let docRef = doc(db,"BookClubs",queryParams.get("id"));
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
  return docSnap;
}

const queryParams = new URLSearchParams(window.location.search);

const docRef = await getClubdocRefFromQParams(queryParams);

for (const user of docRef.data()["ClubUsers"])
{
    let userDocRef = doc(db,"Users", user);
    let userDocSnap = await getDoc(userDocRef);
    let email = userDocSnap.data()["email"];
    appendElement("accepted","a",email, "user/html?id=" + userDocSnap.data()["uid"] )
}

for (const user of docRef.data()["ClubUsersUnaccepted"])
{
    let userDocRef = doc(db,"Users", user);
    let userDocSnap = await getDoc(userDocRef);
    let email = userDocSnap.data()["email"];
    console.log(email)
    appendElement("unacepted","a",email, "user/html?id=" + userDocSnap.data()["uid"] )
}


