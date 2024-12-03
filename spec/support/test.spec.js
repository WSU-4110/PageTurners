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

