import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, collection, addDoc, setDoc, doc} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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
// signup form


const signupForm = document.querySelector("signupForm");

if (signupForm != null) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get user info
        const email = signupForm["email"].value;
        const password = signupForm["password"].value;

        console.log(email, password);

        // Sign up user
        auth.onAuthStateChanged(function(user){
            if (user) {   
            setDoc(doc(db, "Users", user.uid), {
                 email: user.email,
                 uid: user.uid
                });
            }
            });
    });
}

        




const loginForm = document.querySelector("#login-form");

if (loginForm != null)
{
    loginForm.addEventListener('submit', (e)=> {
        e.preventDefault();

        const email = loginForm["email"].value;
        const password = loginForm["password"].value;

        signInWithEmailAndPassword(auth,email,password).then( cred=> {
            console.log(cred);          
            window.signedinemail = email;
            window.location.href = "./dashboard.html";
        }
        )
    })
}
const logout = document.querySelector('#logout');

if (logout != null)
{
logout.addEventListener('click', (e)=>{
    e.preventDefault();

    signOut(auth).then(()=>{
        console.log("User signed out");
        window.location.href = "./bdashboard.html";
    })
    
});
}