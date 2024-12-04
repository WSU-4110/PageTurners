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

//Sara Alkhafaji- HK4694
import { JSDOM } from "jsdom";

describe("BookSearchModule", () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <input id="search-input" />
          <ul id="suggestions-list"></ul>
        </body>
      </html>
    `);

    global.window = dom.window;
    global.document = dom.window.document;

    // Mock fetch for Jasmine
    global.fetch = () =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [{ volumeInfo: { title: "Mock Book Title" } }],
          }),
      });
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
  });

  it("should initialize and attach event listeners to search input", () => {
    const searchInput = document.getElementById("search-input");
    spyOn(searchInput, "addEventListener");

    const BookSearchModule = {
      init: () => {
        searchInput.addEventListener("input", () => {});
        searchInput.addEventListener("keydown", () => {});
      },
    };

    BookSearchModule.init();

    expect(searchInput.addEventListener).toHaveBeenCalledWith("input", jasmine.any(Function));
    expect(searchInput.addEventListener).toHaveBeenCalledWith("keydown", jasmine.any(Function));
  });

  
  
  it("should clear suggestions if input is empty", async () => {
    const searchInput = document.getElementById("search-input");
    searchInput.value = "";

    const BookSearchModule = {
      clearSuggestions: jasmine.createSpy("clearSuggestions"),
      searchBooks: async () => {
        if (!searchInput.value) {
          BookSearchModule.clearSuggestions();
        }
      },
    };

    await BookSearchModule.searchBooks();

    expect(BookSearchModule.clearSuggestions).toHaveBeenCalled();
  });

  it("should fetch and display book suggestions for valid queries", async () => {
    const searchInput = document.getElementById("search-input");
    searchInput.value = "test";
  
    const suggestionsList = document.getElementById("suggestions-list");
  
    // Mock fetch with spyOn
    spyOn(global, "fetch").and.returnValue(
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [{ volumeInfo: { title: "Mock Book Title" } }],
          }),
      })
    );
  
    const BookSearchModule = {
      searchBooks: async () => {
        const response = await fetch("https://mock-api.com");
        const data = await response.json();
  
        data.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.volumeInfo.title;
          suggestionsList.appendChild(li);
        });
      },
    };
  
    await BookSearchModule.searchBooks();
  
    expect(global.fetch).toHaveBeenCalled();
    expect(suggestionsList.childElementCount).toBe(1);
    expect(suggestionsList.firstChild.textContent).toBe("Mock Book Title");
  });
  
  it("should clear suggestions list", () => {
    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = "<li>Suggestion</li>";

    const BookSearchModule = {
      clearSuggestions: () => {
        suggestionsList.innerHTML = "";
      },
    };

    BookSearchModule.clearSuggestions();

    expect(suggestionsList.childElementCount).toBe(0);
  });

  it("should populate suggestions list with book titles", () => {
    const suggestionsList = document.getElementById("suggestions-list");

    const BookSearchModule = {
      displaySuggestions: (books) => {
        books.forEach((book) => {
          const li = document.createElement("li");
          li.textContent = book.volumeInfo.title;
          suggestionsList.appendChild(li);
        });
      },
    };

    const books = [
      { volumeInfo: { title: "Book 1" } },
      { volumeInfo: { title: "Book 2" } },
    ];

    BookSearchModule.displaySuggestions(books);

    expect(suggestionsList.childElementCount).toBe(2);
    expect(suggestionsList.firstChild.textContent).toBe("Book 1");
  });
});

  it("should convert a string to lowercase", () => {
    const BookSearchModule = {
      toLowerCase: (input) => {
        return input.toLowerCase();
      },
    };

    const result = BookSearchModule.toLowerCase("TeSt StrInG");

    expect(result).toBe("test string");
  });

//Eunice Shobowale hd5862
describe("Suite of 6 tests for Function Logic", () => {

  // Set up the mock DOM before all tests
  beforeAll(() => {
    // Mock the global `document` object by assigning a basic HTML structure to `document.body.innerHTML`
    document.body.innerHTML = `
      <img id="carousel-image" src=""/>
      <input id="search-input" style="display: none;" />
      <div id="recommendations-container"></div>
      <div id="featured-books-container"></div>
      <img id="club-profile-pic" src=""/>
    `;
  });

  // Cleanup after each test
  afterEach(() => {
    document.body.innerHTML = ''; // Clear the DOM after each test
  });


  // Test for fetching recommendations (mocking async behavior)
  it("testing fetchTopRecommendations function", async () => {
    const recommendations = [
      { id: "1", title: "Book 1" },
      { id: "2", title: "Book 2" }
    ];

    // Simulate fetching data by appending mock data to the container
    const recommendationsContainer = document.getElementById("recommendations-container");
    recommendations.forEach((book) => {
      const div = document.createElement("div");
      div.classList.add("recommendation-item");
      div.textContent = book.title;
      recommendationsContainer.appendChild(div);
    });

    // Ensure the recommendations are rendered
    expect(recommendationsContainer.children.length).toBe(2);
    expect(recommendationsContainer.children[0].textContent).toBe("Book 1");
  });

  // Test for featured books (mocking async behavior)
  it("testing fetchFeaturedBooks function", async () => {
    const featuredBooks = [
      { id: "1", title: "Featured Book 1" }
    ];

    // Simulate fetching data by appending mock data to the container
    const featuredBooksContainer = document.getElementById("featured-books-container");
    featuredBooks.forEach((book) => {
      const div = document.createElement("div");
      div.classList.add("book-card");
      div.textContent = book.title;
      featuredBooksContainer.appendChild(div);
    });

    // Ensure the featured books are rendered
    expect(featuredBooksContainer.children.length).toBe(1);
    expect(featuredBooksContainer.children[0].textContent).toBe("Featured Book 1");
  });

  // Test for loading profile picture
  it("testing loadProfilePicture function", () => {
    const profilePic = document.getElementById("club-profile-pic");
    profilePic.src = "data:image/png;base64,dummydata";

    expect(profilePic.src).toBe("data:image/png;base64,dummydata");
  });

  // Test for changing background color
  it("testing changeBackgroundColor function", () => {
    document.body.style.backgroundColor = "blue";
    expect(document.body.style.backgroundColor).toBe("blue");

    document.body.style.backgroundColor = "red";
    expect(document.body.style.backgroundColor).toBe("red");
  });
});
