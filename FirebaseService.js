
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

class FirebaseService {
    constructor() {
        if (!FirebaseService.instance) {
            this.firebaseConfig = {
                apiKey: "AIzaSyAt-SInlPaL2FzwtXrRltIEiV5l8k5HMjg",
                authDomain: "pageturners-a831a.firebaseapp.com",
                projectId: "pageturners-a831a",
                storageBucket: "pageturners-a831a.appspot.com",
                messagingSenderId: "304224952392",
                appId: "1:304224952392:web:f33dbc84b481e39a44787d",
                measurementId: "G-C6DKQSJ1R8"
            };

            // Initialize Firebase
            this.app = initializeApp(this.firebaseConfig);
            this.auth = getAuth(this.app);

            FirebaseService.instance = this;
        }

        return FirebaseService.instance;
    }

    getAuth() {
        return this.auth;
    }
}

const instance = new FirebaseService();
Object.freeze(instance); // Prevent modification
export default instance;
