// Import Firebase and FirebaseService
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import FirebaseService from './FirebaseService.js';

// Your web app's Firebase configuration
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
const auth = FirebaseService.getAuth(); // Use the auth from FirebaseService

// Signup form event listener
const signupForm = document.querySelector("#signup-form");
if (signupForm != null) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get user info
        const email = signupForm["email"].value;
        const password = signupForm["password"].value;

        // Sign up user
        createUserWithEmailAndPassword(auth, email, password).then(cred => {
            console.log(cred);
            alert("Account Creation Success");
            window.location.href = "./dashboard.html";
        }).catch(error => {
            console.error("Signup error: ", error);
            alert(error.message);
        });
    });
}

// Login form event listener
const loginForm = document.querySelector("#login-form");
if (loginForm != null) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginForm["email"].value;
        const password = loginForm["password"].value;

        // Sign in user
        signInWithEmailAndPassword(auth, email, password).then(cred => {
            console.log(cred);
            window.signedinemail = email;
            window.location.href = "./dashboard.html";
        }).catch(error => {
            console.error("Login error: ", error);
            alert(error.message);
        });
    });
}

// Logout event listener
const logout = document.querySelector('#logout');
if (logout != null) {
    logout.addEventListener('click', (e) => {
        e.preventDefault();

        signOut(auth).then(() => {
            console.log("User signed out");
            window.location.href = "./index.html"; // Redirect to the login page on logout
        }).catch(error => {
            console.error("Logout error: ", error);
        });
    });
}

// Auth state change listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector("#user-email").textContent = user.email; // Display user email
    }
});





