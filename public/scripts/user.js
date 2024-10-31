import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


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

class UserSingleton
{
    static userObj = null;

    constructor(email = "empty", uid="empty")
    {
        this.email = email
        this.uid = uid
    }

    static async SingletonConstructor()
    {   
        await firebase.auth().onAuthStateChanged((user) => {
            let Singleton = new UserSingelton(user.email, user.uid)
            UserSingelton.userObj = Singleton 
          });

    }


    updateUser()
    {
        UserSingelton.userObj = new UserSingelton();
        return UserSingelton.userObj;
    }

    static async getUser()
    {
        if( UserSingleton.userObj == null)
        {
            console.log("userOPbj is null")
            await UserSingleton.SingletonConstructor();
        }
        return UserSingleton.userObj;
    }

    static async getEmail()
    {
        return UserSingleton.getUser().email
    }

    static getUid()
    {
        return UserSingleton.getUser().uid
    }

}
