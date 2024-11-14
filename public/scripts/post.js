import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, collection, orderBy, getDoc, addDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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
  let userUID = "";
  let userEmail = "";
  auth.onAuthStateChanged(function(user){
    if (user) {
        userUID = user.uid;
        userEmail = user.email;      
    }
  })

const postform = document.getElementById("reply-form");

postform.addEventListener("submit", async function (e) {
    
    e.preventDefault();

    let title = postform["title"].value;
    let body = postform["text"].value;

    //let docRef2 = doc(db,"BookClubs", queryParams.get("id"));
    const discRef = collection(db,"BookClubs",queryParams.get("id"),"DiscussionPosts");

    let docref = await addDoc(discRef, {
        Author: userEmail,
        Body: body,
        Title: title,
        postDate: new Date()
    }).then((e)=>{
        window.location.href = "./clubhomepage.html?id=" + queryParams.get("id");
    })
    
    
    



})