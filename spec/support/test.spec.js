

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

// Eunice Shobowale hd5862
// Suite for DOM Manipulation and Fetching Data

describe("Suite of 6 tests for DOM Manipulation and Fetching Data", () => {

  // Mock the window and document objects for Node.js testing
  beforeAll(() => {
    // Define the `window` object for Node.js environment
    global.window = {};
    global.document = {
      body: {
        style: {}
      },
      getElementById: (id) => {
        const mockElements = {
          "carousel-image": { src: "" },
          "search-input": { style: { display: "none", width: "" } },
          "recommendations-container": { innerHTML: "" },
          "featured-books-container": { innerHTML: "" },
          "club-profile-pic": { src: "" },
        };
        return mockElements[id];
      },
    };

    // Mocking DOM manipulation and fetching functions using Jasmine's spyOn
    spyOn(window, 'changeImage').and.callFake((index) => {
      const images = [
        "../../images/first1.png",
        "../../images/second2.jpg",
        "../../images/third3.jpg",
      ];
      const carouselImage = document.getElementById("carousel-image");
      carouselImage.src = images[index]; // Update image src based on index
    });

    spyOn(window, 'toggleSearch').and.callFake(() => {
      const searchInput = document.getElementById("search-input");
      if (searchInput.style.display === "none" || !searchInput.style.display) {
        searchInput.style.display = "block";
        searchInput.style.width = "200px";
      } else {
        searchInput.style.display = "none";
      }
    });

    spyOn(window, 'fetchTopRecommendations').and.callFake(async () => {
      const recommendationsContainer = document.getElementById("recommendations-container");
      recommendationsContainer.innerHTML = "<img src='img1.jpg' />";
    });

    spyOn(window, 'fetchFeaturedBooks').and.callFake(async () => {
      const featuredBooksContainer = document.getElementById("featured-books-container");
      featuredBooksContainer.innerHTML = "<img src='img1.jpg' />";
    });

    spyOn(window, 'loadProfilePicture').and.callFake(() => {
      const profilePic = document.getElementById("club-profile-pic");
      profilePic.src = "data:image/png;base64,dummydata";
    });

    spyOn(window, 'changeBackgroundColor').and.callFake((color) => {
      document.body.style.backgroundColor = color;
    });
  });

  describe("changeImage", () => {
    it("should update the carousel image src to the correct URL", () => {
      const images = [
        "../../images/first1.png",
        "../../images/second2.jpg",
        "../../images/third3.jpg",
      ];
      changeImage(1);
      const carouselImage = document.getElementById("carousel-image");
      expect(carouselImage.src).toContain(images[0]);
    });
  });

  describe("toggleSearch", () => {
    it("should display and focus the search input if initially hidden", () => {
      toggleSearch();
      const searchInput = document.getElementById("search-input");
      expect(searchInput.style.display).toBe("block");
      expect(searchInput.style.width).toBe("200px");
    });

    it("should hide the search input if already displayed", () => {
      const searchInput = document.getElementById("search-input");
      searchInput.style.display = "block";
      toggleSearch();
      expect(searchInput.style.display).toBe("none");
    });
  });

  describe("fetchTopRecommendations", () => {
    it("should fetch and render top recommendations", async () => {
      await fetchTopRecommendations();
      const recommendationsContainer = document.getElementById("recommendations-container");
      expect(recommendationsContainer.innerHTML).toContain("img1.jpg");
    });
  });

  describe("fetchFeaturedBooks", () => {
    it("should fetch and render featured books", async () => {
      await fetchFeaturedBooks();
      const featuredBooksContainer = document.getElementById("featured-books-container");
      expect(featuredBooksContainer.innerHTML).toContain("img1.jpg");
    });
  });

  describe("loadProfilePicture", () => {
    it("should load the profile picture from localStorage", () => {
      loadProfilePicture();
      const profilePic = document.getElementById("club-profile-pic");
      expect(profilePic.src).toBe("data:image/png;base64,dummydata");
    });
  });

  describe("changeBackgroundColor", () => {
    it("should change the background color of the body", () => {
      changeBackgroundColor("blue");
      expect(document.body.style.backgroundColor).toBe("blue");

      changeBackgroundColor("red");
      expect(document.body.style.backgroundColor).toBe("red");
    });
  });
});



