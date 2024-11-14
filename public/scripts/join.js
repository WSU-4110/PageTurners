import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, updateDoc, arrayUnion, collection, getDoc,setDoc, getDocs, addDoc, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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


const queryParams = new URLSearchParams(window.location.search);

const joinCode = queryParams.get("jc");
auth.onAuthStateChanged(function(user){
    if (user) {
        if (joinCode == null)
        {
            // console.log("wahts up")
            // const form = document.createElement("form")
            // form.setAttribute("id","joinCodeForm");
            // let input = document.createElement("input")
            // input.setAttribute("id","code")
            // input.setAttribute("placeholder","Join Code")
            // input.setAttribute("type","text")

            // let button  = document.createElement("button")
            // button.setAttribute("type","submit")
            // button.textContent = "Join"
            // form.appendChild(input)
            // form.appendChild(button)
            // document.getElementById("joinsection").appendChild(form)

            const joinForm = document.getElementById("joinCodeForm");

            joinForm.addEventListener('submit', async function(e){
                e.preventDefault();

                let enteredJoinCode = joinForm["joinCode"].value;

                const q = query(collection(db,"BookClubs"), where("JoinCode","==",enteredJoinCode));
                const qsnap = await getDocs(q);

                if (!(qsnap.empty))
                {
                    for (const doc of qsnap.docs)
                    {
                        await updateDoc(doc.ref, {
                            ClubUsersUnaccepted: arrayUnion(user.uid)});
                        console.log("success?")
                        window.location.href = "./MyClubs.html";                    }
                }
                else
                {
                    alert("No club with that code exists")
                }
            })
        }
        else{
            const joincodeform = document.getElementById("joinCodeForm");
            joincodeform.remove();            
        }
    }
})