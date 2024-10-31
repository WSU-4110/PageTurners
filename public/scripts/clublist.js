import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function appendElement (elemNode,textNode,href) {
    var container = document.getElementById("listOfClubs");
    var element = document.createElement(elemNode);
    element.setAttribute("href","clubhomepage.html?id=" + href)
    var text = document.createTextNode("\t" +textNode + "\n");
    element.appendChild(text);
    container.appendChild(element);
}


firebase.auth().onAuthStateChanged(function(user){
    if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = getDoc(docRef);
        const q = query(collection(db, "BookClubs"), where("ClubUsers", "array-contains", user.uid));
        const qSnap = getDocs(q).then((snapshot)=>
            {
                let output = ""
                
                for (const doc of snapshot.docs)
                {

                appendElement("a",doc.data()["BookClubName"], doc.id);
                appendElement("p", "\n", "none")
                // output+="\n<a href=\"clubhomepage?" + doc.data()["BookClubName"] +"\" >";
                // output+= doc.data()["BookClubName"];
                // output+= "</a>\n"
                };


                console.log(user.uid);
            })
            }
        else {
        document.getElementById("clubs").textContent = "not signed in";
        }});
    


        


