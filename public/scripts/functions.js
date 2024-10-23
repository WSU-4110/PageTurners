

export async function getClubDocFromQParams(queryParams)
  {
    const q = query(collection(db, "BookClubs"), where("BookClubName", "==", queryParams.get("name")));
    const qsnap = await getDocs(q);

    
    const docData = qsnap.docs[0].data();
    console.log(docData)
    console.log(docData["BookClubName"]);
    return docData;
  }