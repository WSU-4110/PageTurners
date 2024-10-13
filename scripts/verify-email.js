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

const auth = firebase.auth();

// Resend verification email when the button is clicked
document.getElementById('resendVerification').addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        user.sendEmailVerification().then(() => {
            alert("Verification email resent. Please check your inbox.");
        }).catch(error => {
            alert("Error resending verification email: " + error.message);
        });
    } else {
        alert("No user logged in or email already sent.");
    }
});

// Check if the email is verified and redirect if verified
auth.onAuthStateChanged((user) => {
    if (user) {
        user.reload().then(() => {
            if (user.emailVerified) {
                // Update message and redirect to home page
                document.getElementById('message').textContent = "Email verified! Redirecting to homepage...";
                setTimeout(() => {
                    window.location.href = 'home.html'; // Replace 'home.html' with whatever we name homepage
                }, 2000);  // Redirects after 2 seconds
            } else {
                alert("Please verify your email to continue."); //May omit this part, possibly limited access if do not verify
            }
        });
    } else {
        alert("No user is currently logged in.");
    }
});
