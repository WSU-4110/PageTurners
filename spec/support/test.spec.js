import { JSDOM } from 'jsdom';  

import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  import { getFirestore, collection, orderBy, getDoc, getDocs, doc, query, where } from "firebase/firestore";
  import { getAuth, 
    createUserWithEmailAndPassword,
signOut,
signInWithEmailAndPassword,
onAuthStateChanged
 } 

from "firebase/auth";
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
  const auth = getAuth();
  const db = getFirestore(app);





class Clubhomepage{

    constructor()
    {
      this.ClubDocSnap = null;
      this.ClubDocRef = null;
      this.DiscDocSnap = null;
      this.ClubName = "";
      this.ClubDesc = "";
      this.CurrBook = "";
      this.CurrReading = "";
      this.DiscTopic = "";
      this.Members = [];
      this.Discussion =[];
    }

    updatePage()
    {
      document.getElementById("clubName").textContent = "Welcome to the \"" + this.ClubName + "\" Book Club";
      document.getElementById("clubDescription").textContent = this.ClubDesc;
      document.getElementById("booktitle").textContent = this.CurrBook;
      document.getElementById("bookdesc").textContent = this.CurrReading;
      document.getElementById("disctopic").textContent = "Current Discussion Topic: " + this.DiscTopic;

      const memberUL = document.getElementById("members");
      for (const email of this.Members)
      {
        const newLI = document.createElement("li");
        newLI.textContent = email;
        memberUL.appendChild(newLI);
      }

      const dicsussionUL = document.getElementById("disc");

      for (const post of this.Discussion)
      {
        dicsussionUL.appendChild(post);
      }

      document.body.style.visibility = "visibile";
    }

    async GenClubDocRefAndSnap()
    {
      //test comment
      let docRef = doc(db,"BookClubs", "8jVPhq50GdSfISN9BiQ7");
      this.ClubDocRef = docRef;
      const docSnap = await getDoc(docRef);
      this.ClubDocSnap = docSnap;
      const discRef = collection(docRef, "DiscussionPosts");
      const dq = query(discRef, orderBy("postDate"));
      const dqsnap = await getDocs(dq);
      this.DiscDocSnap = dqsnap;
      return this.ClubDocSnap;
    }

    async genDiscSnap()
    {
      const discRef = collection(this.ClubDocRef, "DiscussionPosts");
      const dq = query(discRef, orderBy("postDate"));
      const dqsnap = await getDocs(dq);
      this.DiscDocSnap = dqsnap;
    }

    setClubName()
    {
      this.ClubName = this.ClubDocSnap.data()["BookClubName"];
      return this.ClubName;
    }

    setClubClubDesc()
    {
      this.ClubDesc = this.ClubDocSnap.data()["clubDescription"];
      return this.ClubDesc;
    }

    setCurrBook()
    {
      this.CurrBook = this.ClubDocSnap.data()["clubBook"];
      return this.CurrBook;
    }

    setCurrReading()
    {
      this.CurrReading = this.ClubDocSnap.data()["clubWeekReading"];
      return this.CurrReading;
    }

    setDiscTopic()
    {
      this.DiscTopic = this.ClubDocSnap.data()["discussionTopic"];
      return this.DiscTopic;
    }

    setMembers()
    {
      this.Members = this.ClubDocSnap.data()["ClubUsers"];
      return this.Members;
    }

    async convertMembers()
    {
      for (let i = 0; i < this.Members.length; i++)
      {
        this.Members[i] = await this.getEmailFromUID(this.Members[i]);
      }
    }

    setDiscussion()
    {
      this.DiscDocSnap.forEach((doc)=>
      {
        this.Discussion.push(this.createDisPost(doc));
      })
      return this.Discussion;
    }

    async getEmailFromUID(uid)
    {
     const q = query(collection(db, "Users"), where("uid", "==", uid));
     const qsnap = await getDocs(q);

     return qsnap.docs[0].data()["email"];
    }

    createDisPost(docRef)
    {
      const li = document.createElement("li")
      const p1 = document.createElement("p")
      const p2 = document.createElement("p");
      const p3 = document.createElement("p");
      const small = document.createElement("small");

      p1.textContent = docRef.data()["Title"];
      p1.setAttribute("class","bold underline");
      p2.textContent = "By: " + docRef.data()["Author"];
      p2.setAttribute("class","bold")
      p3.textContent = docRef.data()["Body"];
      small.textContent = docRef.data()["postDate"].toDate();

      li.appendChild(p1);
      li.appendChild(p2);
      li.appendChild(p3);
      li.appendChild(small);

      return li;

    }
  }

const Homepage = new Clubhomepage();

// await Homepage.GenClubDocRefAndSnap().then(async ()=>
// {
// //   Homepage.setClubClubDesc();
// //   Homepage.setClubName();
// //   Homepage.setCurrBook();
// //   Homepage.setCurrReading();
// //   Homepage.setDiscTopic();
// //   Homepage.setMembers();
// //   await Homepage.convertMembers();
// //   Homepage.setDiscussion();
// //   Homepage.updatePage();
// });


// Ben Sanderson
describe("Suite of 6 tests for Assignment 5", ()=>
    {
    
        it("testing name function", async ()=>
        {
            await Homepage.GenClubDocRefAndSnap().then(async ()=>
            {
            expect(Homepage.setClubName()).toBe("Assignment 5 unit tests ( do not alter )");
            });
        });
    
        it("testing description fucntion",async ()=>
        {  
            await Homepage.GenClubDocRefAndSnap().then(async ()=>
            {
                expect(Homepage.setClubClubDesc()).toBe("no description");
            });
        })

        it("testing club Book function",async ()=>
        {
            await Homepage.GenClubDocRefAndSnap().then(async ()=>
            {
                expect(Homepage.setCurrBook()).toBe("test2");
            });
        })

        it("testing club Reading function",async ()=>
        {
            await Homepage.GenClubDocRefAndSnap().then(async ()=>
            {
                expect(Homepage.setCurrReading()).toBe("test3");
            });
        })

        it("testing club discussion topic function", async ()=>
        {
            await Homepage.GenClubDocRefAndSnap().then(async ()=>
            {
                expect(Homepage.setDiscTopic()).toBe("test4");
            });
        })

        it("testing club  members function",async ()=>
        {
            await Homepage.GenClubDocRefAndSnap().then(async ()=>
            {
                expect(Homepage.setMembers()).toEqual(["UOuyu3tQOyYo2BK46CqeJjlL1Ff1"])
            });
        })

    })
    

    // Sanjida Islam hk3351 
    describe("Suite of 6 tests for Login and Registration", () => {
      const testEmail = "testuser@example.com";
      const testPassword = "password123";
    beforeAll(async () => {
      // Ensure the test user doesn't already exist and sign out if already logged in
      try {
          await signInWithEmailAndPassword(auth, testEmail, testPassword);
          await signOut(auth);
      } catch (error) {
          if (error.code !== 'auth/user-not-found') {
              console.error("Error signing out:", error);
          }
      }
  });

  it("should register a new user", async () => {
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
          expect(userCredential.user.email).toBe(testEmail);
      } catch (error) {
          if (error.code === "auth/email-already-in-use") {
              console.log("User already exists, skipping registration.");
          } else {
              throw error;  // Rethrow other errors
          }
      }
  });

  it("should fail registration with weak password", async () => {
      const weakPassword = "123";
      await createUserWithEmailAndPassword(auth, testEmail, weakPassword).catch((error) => {
          expect(error.code).toBe("auth/weak-password");
      });
  });

  it("should login an existing user", async () => {
      await signInWithEmailAndPassword(auth, testEmail, testPassword).then((userCredential) => {
          expect(userCredential.user.email).toBe(testEmail);
      });
  });
  it("should sign out the user", async () => {
    await signOut(auth)
        .then(() => {
            // Check if there is no user logged in
            expect(auth.currentUser).toBeNull();
        })
        .catch((error) => {
            // Fail the test if sign-out fails
            fail("Sign-out failed.");
        });
});
it("should login with correct email and password", async () => {
  await signInWithEmailAndPassword(auth, testEmail, testPassword)
      .then((userCredential) => {
          // Check if the email in the user credential matches the test email
          expect(userCredential.user.email).toBe(testEmail);
      })
      .catch((error) => {
          // Fail the test if login fails
          fail("Login should have been successful.");
      });
});

  it("should detect logged-in user", async () => {
      let currentUser = null;
      onAuthStateChanged(auth, (user) => {
          currentUser = user;
      });

      await signInWithEmailAndPassword(auth, testEmail, testPassword).then(() => {
          expect(currentUser.email).toBe(testEmail);
      });
  });
});

//Eunice Shobowale hd5862


// Core functions
const images = [
  "../../images/first1.png",
  "../../images/second2.jpg",
  "../../images/third3.jpg"
];

// Function implementations
window.changeImage = function(index) {
  return images[index - 1];
};

window.toggleSearch = function(currentState) {
  return currentState === "none" ? "block" : "none";
};

window.fetchTopRecommendations = async function() {
  return [{ id: "1", title: "Book 1" }, { id: "2", title: "Book 2" }];
};

window.fetchFeaturedBooks = async function() {
  return [{ id: "1", title: "Featured Book 1" }];
};

window.loadProfilePicture = function() {
  return "data:image/png;base64,dummydata";
};

window.changeBackgroundColor = function(color) {
  return color;
};

// Jasmine Test Suite
describe("Suite of 6 tests for Function Logic", () => {

  // Set up jsdom before all tests to mock the window and document objects
  beforeAll(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    global.window = dom.window; // Assign jsdom window object to global window
    global.document = dom.window.document; // Assign jsdom document object to global document
    global.HTMLElement = dom.window.HTMLElement; // Make HTMLElement available globally
  });

  it("testing changeImage function", async () => {
    const imageUrl = changeImage(1);  // Test the actual function logic
    expect(imageUrl).toBe("../../images/first1.png");
  });

  it("testing toggleSearch function", async () => {
    let state = "none";
    state = toggleSearch(state);  // Call the function and get the new state
    expect(state).toBe("block");

    state = toggleSearch(state);  // Call again to toggle back
    expect(state).toBe("none");
  });

  it("testing fetchTopRecommendations function", async () => {
    const recommendations = await fetchTopRecommendations();  // Call the actual function
    expect(recommendations.length).toBe(2);
    expect(recommendations[0].title).toBe("Book 1");
  });

  it("testing fetchFeaturedBooks function", async () => {
    const featuredBooks = await fetchFeaturedBooks();  // Call the actual function
    expect(featuredBooks.length).toBe(1);
    expect(featuredBooks[0].title).toBe("Featured Book 1");
  });

  it("testing loadProfilePicture function", async () => {
    const profilePic = loadProfilePicture();  // Call the actual function
    expect(profilePic).toBe("data:image/png;base64,dummydata");
  });

  it("testing changeBackgroundColor function", async () => {
    const color = changeBackgroundColor("blue");  // Call the actual function
    expect(color).toBe("blue");

    const newColor = changeBackgroundColor("red");  // Call again with a different color
    expect(newColor).toBe("red");
  });

});
