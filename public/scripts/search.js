const BookSearchModule = (function() {
    const apiKey = 'AIzaSyA-QEgCdTmslsgP14eqrkYOB3CxNRcT-eE';

    // Initialize search functionality
    function init() {
        const searchInput = document.getElementById('search-input');
        const suggestionsList = document.getElementById('suggestions-list');

        if (searchInput) {
            searchInput.addEventListener('input', searchBooks);
            searchInput.addEventListener('keydown', handleEnterPress);
        }

        if (window.location.pathname.includes('results.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('q');
            if (searchQuery) {
                document.getElementById('search-query').textContent = searchQuery;
                fetchSearchResults(searchQuery);
            }
        }
    }

    // Handle 'Enter' key to navigate to results
    function handleEnterPress(e) {
        const searchInput = e.target;
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length > 0) {
                window.location.href = `results.html?q=${encodeURIComponent(query)}`;
            }
        }
    }

    // Fetch book suggestions
    async function searchBooks() {
        const query = document.getElementById('search-input').value.trim();
        if (query.length < 3) return clearSuggestions();

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
            const data = await response.json();
            displaySuggestions(data.items);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // Display suggestions
    function displaySuggestions(books) {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
        if (!books) return;

        books.slice(0, 5).forEach(book => {
            const suggestion = document.createElement('li');
            suggestion.className = 'suggestion-item';
            suggestion.innerHTML = `
                <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/40x60'}" alt="Book Cover">
                <div><strong>${book.volumeInfo.title || 'No title'}</strong></div>
            `;
            suggestion.onclick = () => {
                document.getElementById('search-input').value = book.volumeInfo.title || 'No title';
                suggestionsList.innerHTML = '';
            };
            suggestionsList.appendChild(suggestion);
        });
    }

    // Fetch and display full search results
    async function fetchSearchResults(query) {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
            if (!responce.ok) throw new Error('failed to fetch results');
            const data = await response.json();
            console.log(data)
            displayResults(data.items);
        } catch (error) {
            console.error('Error fetching books:', error);
            displayResults([]);
        }
    }

    // Display full search results
    function displayResults(books) {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = books?.map(book => {
            const bookId = book.id;  // Correcting the mistake here
            const bookTitle = book.volumeInfo.title || 'No title';

            return `
                <div class="result-item">
                    <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}" alt="Book Cover">
                    <h3>${book.volumeInfo.title || 'No title'}</h3>
                    <p>by ${book.volumeInfo.authors?.join(', ') || 'Unknown author'}</p>
                    <p>${(book.volumeInfo.description || 'No description available').slice(0, 100)}...</p>
                    <button onclick="markAsReading('${bookId}', '${bookTitle}')">Mark as Reading</button>
                </div>
            `;
        }).join('') || '<p>No results found</p>';
    }

    // Clear suggestions
    function clearSuggestions() {
        document.getElementById('suggestions-list').innerHTML = '';
    }

    return { init };
})();
async function markAsReading(bookId, bookTitle) {
    const userResponse = confirm("Mark as 'Currently Reading'?");
    const readingStatus = userResponse ? 'Currently Reading' : 'Want to Read';

    // Save the book data to Firebase
    const bookData = {
        bookId,
        title: bookTitle,
        status: readingStatus,
        progress: 0 // Start at 0% if "Currently Reading"
    };
    
    await firebase.firestore().collection('users').doc('USER_ID').collection('readingList').doc(bookId).set(bookData);
    alert(`Book marked as '${readingStatus}'`);
}
async function loadCurrentReading() {
    const readingSection = document.getElementById('current-reading');
    const snapshot = await firebase.firestore().collection('users').doc('USER_ID').collection('readingList').where('status', '==', 'Currently Reading').get();
    
    if (!snapshot.empty) {
        const book = snapshot.docs[0].data();
        readingSection.innerHTML = `
            <h3>Currently Reading</h3>
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>Progress: ${book.progress}%</p>
                <input type="range" min="0" max="100" value="${book.progress}" onchange="updateProgress('${book.bookId}', this.value)" />
            </div>
        `;
    } else {
        readingSection.innerHTML = '<p>No books currently being read.</p>';
    }
}
async function updateProgress(bookId, progress) {
    await firebase.firestore().collection('users').doc('USER_ID').collection('readingList').doc(bookId).update({ progress: parseInt(progress) });
    alert(`Progress updated to ${progress}%`);
    loadCurrentReading(); // Refresh the displayed progress
}

// Initialize the module
document.addEventListener('DOMContentLoaded', () => {
BookSearchModule.init();
});