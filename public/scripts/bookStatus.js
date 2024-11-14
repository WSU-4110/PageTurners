import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";

// Load saved status from Firebase
async function loadBookStatus(bookId) {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const docRef = doc(db, 'users', user.uid, 'myBooks', bookId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Error loading book status:", error);
        return null;
    }
}

// Load all books from Firebase
async function loadAllBooks() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const booksRef = collection(db, 'users', user.uid, 'myBooks');
        const querySnapshot = await getDocs(booksRef);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error loading books:", error);
        return [];
    }
}

// Utility object for "My Books" page updates
const BookStatus = (function () {
    async function updateMyBooksPage() {
        const myBooksContainer = document.getElementById('my-books-container');
        const books = await loadAllBooks(); // Fetch books from Firebase

        if (myBooksContainer) {
            myBooksContainer.innerHTML = books.map(book => `
                <div class="my-book-item">
                    <h3>${book.title}</h3>
                    <p>Status: ${book.status}</p>
                    <p>Progress: ${book.progress || 0}%</p>
                    <div class="update-status-section">
                        <label for="reading-status-${book.bookId}">Update Status:</label>
                        <select id="reading-status-${book.bookId}">
                            <option value="">Select Status</option>
                            <option value="Want to Read" ${book.status === "Want to Read" ? "selected" : ""}>Want to Read</option>
                            <option value="Currently Reading" ${book.status === "Currently Reading" ? "selected" : ""}>Currently Reading</option>
                            <option value="Finished" ${book.status === "Finished" ? "selected" : ""}>Finished</option>
                        </select>
                        <button onclick="saveStatus('${book.bookId}', '${book.title}')">Save Status</button>
                    </div>
                </div>
            `).join('');
        }
    }

    return { updateMyBooksPage };
})();

// Function to save the status when the "Save Status" button is clicked
window.saveStatus = async function(bookId, bookTitle) {
    const status = document.getElementById(`reading-status-${bookId}`).value;
    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in first.");
        return;
    }

    if (!status) {
        alert("Please select a status before saving.");
        return;
    }

    const bookData = { bookId, title: bookTitle, status, progress: 0 };

    try {
        await setDoc(doc(db, 'users', user.uid, 'myBooks', bookId), bookData);
        alert(`Book marked as '${status}'`);
        BookStatus.updateMyBooksPage(); // Refresh the "My Books" page
    } catch (error) {
        console.error('Error saving book status:', error);
        alert("Failed to save book status. Please try again.");
    }
};

export default BookStatus;
