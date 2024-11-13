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

function createBookClubElem(doc)
{
    let a = document.createElement("a")
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let p = document.createElement("p")

    a.href = "./clubhomepage.html?id=" + doc.id;
    h3.textContent = doc.data()["BookClubName"];
    p.textContent = doc.data()["clubDescription"];
    div.setAttribute("class","book-club-item");
    div.appendChild(h3);
    div.appendChild(p);
    a.appendChild(div);

    return a;
    
}
function createBookClubElemNoLink(doc)
{
    
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let p = document.createElement("p")

    
    h3.textContent = doc.data()["BookClubName"];
    p.textContent = doc.data()["clubDescription"];
    div.setAttribute("class","book-club-item");
    div.appendChild(h3);
    div.appendChild(p);
    

    return div;
    
}

auth.onAuthStateChanged(function(user){
    if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = getDoc(docRef);
        const q = query(collection(db, "BookClubs"), where("ClubUsers", "array-contains", user.uid));
        const qSnap = getDocs(q).then((snapshot)=>
            {
                const clublist = document.getElementById("list2");

                for (const doc of snapshot.docs)
                {

                    clublist.appendChild(createBookClubElem(doc));
                    
                };
                const q2 = query(collection(db, "BookClubs"), where("ClubUsersUnaccepted", "array-contains", user.uid));
                const qsnap = getDocs(q2).then((snapshot)=>
                {
                    const clublist2 = document.getElementById("list1");

                    for (const doc of snapshot.docs)
                    {
                        clublist2.appendChild(createBookClubElemNoLink(doc))
                    }
                })
                console.log(user.uid);
            })
            }
        else {
        document.getElementById("clubs").textContent = "not signed in";
        }});
    



