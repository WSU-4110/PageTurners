import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, getDocs, addDoc, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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

async function isAdmin(userUID)
{
    const docRef = await getClubdocRefFromQParams(new URLSearchParams(window.location.search));
    if (docRef.data()["ClubAdmins"].includes(userUID))
    {
        return 1;
    }
    return 0;
}



function appendElement (parentID,elemNode,textNode,href) {
    var container = document.getElementById(parentID);
    var element = document.createElement(elemNode);
    var element2 = document.createElement("li");

    element.setAttribute("href",href)
    var text = document.createTextNode("\t" +textNode + "\n");
    element.appendChild(text);
    element2.appendChild(element)
    container.appendChild(element2);
    return container
}

function appendButtonWithIDAndUID(container, id, text, UID)
{
    let element = document.createElement("button");
    element.setAttribute("operation",id);
    element.textContent = text;
    element.setAttribute("class", "upload-btn")
    element.setAttribute("uid",UID)
    container.appendChild(element)
}

async function getClubdocRefFromQParams(queryParams)
{
  let docRef = doc(db,"BookClubs",queryParams.get("id"));
  const docSnap = await getDoc(docRef);
  return docSnap;
}

const queryParams = new URLSearchParams(window.location.search);

const docRef = await getClubdocRefFromQParams(queryParams);

for (const user of docRef.data()["ClubUsers"])
{
    let userDocRef = doc(db,"Users", user);
    let userDocSnap = await getDoc(userDocRef);
    let email = userDocSnap.data()["email"];
    let container = appendElement("accepted","a",email, "user/html?id=" + userDocSnap.data()["uid"] )
    let HorizontalUL = document.createElement("ul");
    container.appendChild(HorizontalUL);
    if (await isAdmin(userDocSnap.data()["uid"]) == 1)
    {
        appendButtonWithIDAndUID(HorizontalUL,"admin-tag", "ADMIN",userDocSnap.data()["uid"]);
        appendButtonWithIDAndUID(HorizontalUL,"demote", "Demote",userDocSnap.data()["uid"]);
    }
    else{
        appendButtonWithIDAndUID(HorizontalUL,"kick", "Kick",userDocSnap.data()["uid"]);
        appendButtonWithIDAndUID(HorizontalUL,"promote", "Promote",userDocSnap.data()["uid"]);
    }
}

for (const user of docRef.data()["ClubUsersUnaccepted"])
{
    let userDocRef = doc(db,"Users", user);
    let userDocSnap = await getDoc(userDocRef);
    let email = userDocSnap.data()["email"];
    let container = appendElement("unacepted","a",email, "user/html?id=" + userDocSnap.data()["uid"] )
    appendButtonWithIDAndUID(container, "accept", "Accept", userDocSnap.data()["uid"])
}

const abuttons = document.querySelectorAll('[operation="accept"]');
if (abuttons != null)
{
    abuttons.forEach(button=>{
        button.addEventListener("click", async function(e)
        {
            e.preventDefault();

            await updateDoc(docRef.ref, {
                ClubUsers: arrayUnion(button.getAttribute("uid"))
            })

            await updateDoc(docRef.ref, {
                ClubUsersUnaccepted: arrayRemove(button.getAttribute("uid"))
            })

            alert("Succsessfully Accepted user");
            location.reload()

        })
    })
}
const buttons = document.querySelectorAll('[operation="kick"]')
if (buttons != null)
{
    buttons.forEach(button=>{
        button.addEventListener("click", async function(e)
        {
            e.preventDefault();

            if (docRef.data()["ClubAdmins"].includes(button.getAttribute("uid")))
            {
                alert("Cannot Kick Admin");
            }else
            {
                console.log("MMMMM");
                await updateDoc(docRef.ref, {
                    ClubUsers: arrayRemove(button.getAttribute("uid"))
                })

                alert("Succsessfully Kicked User");
                location.reload()
            }
        })
    })
}

const adbuttons = document.querySelectorAll('[operation="promote"]')
if (adbuttons != null)
{
    adbuttons.forEach(button=>{
        button.addEventListener("click", async function(e)
        {
            e.preventDefault();


            

            await updateDoc(docRef.ref, {
                ClubAdmins: arrayUnion(button.getAttribute("uid"))
            })

            alert("Succsessfully Promoted User");
            location.reload()
        
        })
    })
}

const dbuttons = document.querySelectorAll('[operation="demote"]')
if (dbuttons != null)
{
    dbuttons.forEach(button=>{
        button.addEventListener("click", async function(e)
        {
            e.preventDefault();


            
    
            await updateDoc(docRef.ref, {
                ClubAdmins: arrayRemove(button.getAttribute("uid"))
            })

            alert("Succsessfully Demoted User");
            location.reload()
        
        })
    })
}



