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

//get HTML element for display
let myDiscussions = document.getElementById('myDiscussions');
//store snapshot in each element of list
function getDiscussions() {
    const dbRef = ref(db)
    get(child(dbRef, "discussions"))
    .then((snapshot)=>{
        var allDiscussions = [];
        snapshot.forEach(childSnapshot =>{
            allDiscussions.push(childSnapshot.val()).then((discussions)=>{
                discussions.forEach(entry =>{addEntryToList(entry)})
            }
            );
        });

    });

}
//creating a list, adding entries
function addEntryToList(entry){
    let value = entry.val();

    let replies = document.createElement('li');
    replies.innerHTML = "replies: " + value.replies;

    let list = document.createElement('ul');
    list.append(replies);
    myDiscussions.append(list);
}
//event to force function
window.addEventListener('load',getDiscussions );