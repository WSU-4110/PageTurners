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

const clubCreateForm = document.querySelector("#createClubForm");

auth.onAuthStateChanged(function(user){

    clubCreateForm.addEventListener('submit', async function(e){
        e.preventDefault();
        const clubName = clubCreateForm["clubname"].value;
        const joinCode = clubCreateForm["joincode"].value;
        let bookClubsRef = collection(db, "BookClubs");
        const q = query(bookClubsRef, where("BookClubName", "==", clubName));
        const qsnap = await getDocs(q)



        if (qsnap.empty){
            const docRef = await addDoc(collection(db,"BookClubs"), {
                BookClubName: clubName,
                ClubUsers: [user.uid],
                ClubUsersUnaccepted: [],
                ClubOwner: user.uid,
                ClubAdmins: [user.uid],
                JoinCode: joinCode,
                clubDescription: "no description",
                clubBook: "No Current Book",
                clubWeekReadingStart: 0,
                clubWeekReadingEnd: 0,
                discussionTopic: "No Current Discussion Topic"
            }, clubName);

            const subColl = collection(docRef, "DiscussionPosts");
            
            addDoc(subColl, {Title: "Congratulations on Club Creation",
                Body: "We hope you enjoy your new book club! Happy Reading :)",
                Author: "PageTurners Team",
                postDate: new Date()})
           
            window.location.href = "./dashboard.html";

        }
        else{
            alert("Club Name Allready Exists")
        }
        


    })
});

