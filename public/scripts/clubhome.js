import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, collection, orderBy, getDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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
  auth.onAuthStateChanged(function(user){
    if (user) {
        userUID = user.uid;      
    }
  })

  function createDisPost(docRef)
  {
    const li = document.createElement("li")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p");
    const p3 = document.createElement("p");
    const small = document.createElement("small");

    p1.textContent = docRef.data()["Title"];
    p1.setAttribute("class","bold underline");
    p2.textContent = "By: " + docRef.data()["Author"];
    p2.setAttribute("class","bold")
    p3.textContent = docRef.data()["Body"];
    small.textContent = docRef.data()["postDate"].toDate();

    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(p3);
    li.appendChild(small);

    return li;

  }

  async function isAdmin(userUID)
  {
      const docRef = await getClubdocRefFromQParams(new URLSearchParams(window.location.search));
      if (docRef.data()["ClubAdmins"].includes(userUID))
      {
          return 1;
      }
      return 0;
  }

  async function getClubdocRefFromQParams(queryParams)
  {
    let docRef = doc(db,"BookClubs", queryParams.get("id"));
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    return docSnap;
  }




  async function getEmailFromUID(uid)
  {
    const q = query(collection(db, "Users"), where("uid", "==", uid));
    const qsnap = await getDocs(q);

    return qsnap.docs[0].data()["email"];
  }

  if (await isAdmin(userUID) == 1)
    {
      document.getElementById("manage").href = "overview.html?id=" + docRef.id;
    }
    else
    {
      let elem = document.getElementById("manage")
      elem.remove()
    }

    const post = document.getElementById("post");
    post.href = "discussionpost.html?id=" + queryParams.get("id");
  

  let docRef = await getClubdocRefFromQParams(queryParams);

  document.getElementById("clubName").textContent = "Welcome to the \"" + docRef.data()["BookClubName"] + "\" Book Club"
  document.getElementById("clubDescription").textContent = docRef.data()["clubDescription"]
  document.getElementById("booktitle").textContent = docRef.data()["clubBook"];
  document.getElementById("bookdesc").textContent = docRef.data()["clubWeekReading"];
  document.getElementById("disctopic").textContent = "Current Discussion Topic: " + docRef.data()["discussionTopic"]
  const parentUL = document.getElementById("members");


  for (const uid of docRef.data()["ClubUsers"])
  {
    const newLI = document.createElement("li");
    newLI.textContent = await getEmailFromUID(uid);

    parentUL.appendChild(newLI);
  }
  let docRef2 = doc(db,"BookClubs", queryParams.get("id"));
  
  const discRef = collection(docRef2, "DiscussionPosts");
  const dq = query(discRef, orderBy("postDate"));
  const dqsnap = await getDocs(dq);

  let elem;

  dqsnap.forEach((doc)=>{

    elem = createDisPost(doc);
    document.getElementById("disc").appendChild(elem);
  })


 
