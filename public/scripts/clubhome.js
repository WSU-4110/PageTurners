import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getFirestore, collection, orderBy, getDoc, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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
  const apiKey = 'AIzaSyBqG0BFb33Rs14ofEIfIrsCunnWedF5YSY';


  document.body.style.visibility = "visible";
  const queryParams = new URLSearchParams(window.location.search);
  let userUID = "";
  let userEmail = "";
  auth.onAuthStateChanged(function(user){
    if (user) {
        userUID = user.uid;
        userEmail = user.email;    
    }
  });


  async function isAdmin(userUID, docRef)
  {
      if (docRef.data()["ClubAdmins"].includes(userUID))
      {
          return 1;
      }
      return 0;
  }

  
  class Clubhomepage{

    constructor()
    {
      this.ClubDocSnap = null;
      this.ClubDocRef = null;
      this.DiscDocSnap = null;
      this.ClubName = "";
      this.ClubDesc = "";
      this.bookApiJson = "";
      this.DiscTopic = "";
      this.Members = [];
      this.Discussion =[];
    }

    updatePage()
    {
      document.getElementById("clubName").textContent = "Welcome to the \"" + this.ClubName + "\" Book Club";
      document.getElementById("clubDescription").textContent = this.ClubDesc;
      document.getElementById("disctopic").textContent = "Current Discussion Topic: " + this.DiscTopic;
      
      if (!(this.bookApiJson == null))
      {
        document.getElementById("booktitle").textContent = this.bookApiJson.volumeInfo.title;
        document.getElementById("bookdesc").innerHTML = this.bookApiJson.volumeInfo.description;
        document.getElementById("bookcover").setAttribute("src",this.bookApiJson.volumeInfo.imageLinks?.large)
        this.setupProgBar()
      }

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
      let docRef = doc(db,"BookClubs", queryParams.get("id"));
      this.ClubDocRef = docRef;
      const docSnap = await getDoc(docRef);
      this.ClubDocSnap = docSnap;
      const discRef = collection(docRef, "DiscussionPosts");
      const dq = query(discRef, orderBy("postDate"));
      const dqsnap = await getDocs(dq);
      this.DiscDocSnap = dqsnap;
      return this.ClubDocSnap;
    }

    setupProgBar()
    {
      const totalPages = this.bookApiJson.volumeInfo.pageCount;
      const pageStart = this.ClubDocSnap.data()["clubWeekReadingStart"];
      const pageEnd = this.ClubDocSnap.data()["clubWeekReadingEnd"];

      document.getElementById("green").style.width = ""+pageStart/totalPages*100+"%";
      document.getElementById("red").style.width = ""+pageEnd/totalPages*100+"%";
      document.getElementById("totalp").textContent = "Total Pages: " + totalPages;
      document.getElementById("pagest").textContent = "Pages to Read This Week: pp"+pageStart+"-pp" + pageEnd;

    }

    async genDiscSnap()
    {
      const discRef = collection(this.ClubDocRef, "DiscussionPosts");
      const dq = query(discRef, orderBy("postDate"));
      const dqsnap = await getDocs(dq);
      this.DiscDocSnap = dqsnap;
    }

    async setBook(bookid)
    {
      if (bookid == "No Current Book" || bookid == "")
      {
        this.bookApiJson=null;
        return;
      }
      fetch(`https://www.googleapis.com/books/v1/volumes/${bookid}?key=${apiKey}`)
        .then(response => {
          if (!response.ok)
          {
            this.bookApiJson = null;
          }
          return response.json();
        })
        .then(data=>{
          this.bookApiJson = data;
        })

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

    getClubDoc()
    {
      return this.ClubDocSnap;
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



await Homepage.GenClubDocRefAndSnap().then(async (clubdoc)=>
{
  
  Homepage.setClubClubDesc();
  Homepage.setClubName();
  Homepage.setDiscTopic();
  Homepage.setMembers();
  await Homepage.setBook(clubdoc.data()["clubBook"]);
  await Homepage.convertMembers();
  await Homepage.genDiscSnap().then(()=>
  {
    Homepage.setDiscussion();
  })
  Homepage.updatePage();
  const post = document.getElementById("post");
  post.href = "discussionpost.html?id=" + queryParams.get("id");
});

if (await isAdmin(userUID, Homepage.getClubDoc()) == 1)
  {
    document.getElementById("manage").href = "overview.html?id=" + Homepage.getClubDoc().id;
  }
  else
  {
    let elem = document.getElementById("manage")
    elem.remove()
  }





