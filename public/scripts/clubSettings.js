import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, deleteDoc, addDoc, collection, getDoc, updateDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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
 
  const clubEditForm = document.getElementById("clubmanage");
  
  clubEditForm.addEventListener('submit', async function(e){
    e.preventDefault();
    let title = clubEditForm["currBook"].value;
    let reading = clubEditForm["currentReading"].value;
    let disc = clubEditForm["DiscTopic"].value;
    if (title== "")
    {
      title = docRef.data()["clubBook"];
    }
    if (reading == "")
    {
      reading = docRef.data()["clubWeekReading"];
    }
    if (disc == "")
    {
      disc = docRef.data()["discussionTopic"];
    }
    
    await updateDoc(doc(db,"BookClubs", docRef.id), {
    clubBook: title,
    clubWeekReading: reading,
    discussionTopic: disc
    }, title).then(()=>
    {
        window.location.href = "./clubhomepage.html?id=" + docRef.id;
    })

    // if (clubEditForm["del"].value == "on")
    // {
        
    //     let discRef = collection(db,"BookClubs", docRef.id, "DiscussionPosts");
    //     const dq = query(discRef);
    //     const dqsnap = await getDocs(dq);
        
    //     for (const docu in dq)
    //     {
    //         await deleteDoc(doc(db,"BookClubs", docu.id, "DiscussionPosts",docu.id));
    //     }

    //     addDoc(disccol, {Title: "Club Discussion Was Cleared",
    //         Body: "At the time of this post the club discussion board was cleared",
    //         Author: "PageTurners Team",
    //         postDate: new Date()}).then((e)=>{
    //             window.location.href = "./clubhomepage.html?id=" + docRef.id;
    //         })
        

    // }
})

