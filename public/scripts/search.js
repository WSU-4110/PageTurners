const BookSearchModule = (function () {
    const apiKey = 'AIzaSyA-QEgCdTmslsgP14eqrkYOB3CxNRcT-eE';

    /**
     * Initializes the search module, attaching event listeners to the search input.
     */
    function init() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', searchBooks);
            searchInput.addEventListener('keydown', handleEnterPress);
        }
    }

    /**
     * Handles the Enter keypress in the search input and navigates to the results page.
     * @param {KeyboardEvent} e - The keydown event.
     */
    function handleEnterPress(e) {
        const searchInput = e.target;
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length > 0) {
                window.location.assign(`results.html?q=${encodeURIComponent(query)}`);
            }
        }
    }

    /**
     * Searches for books using the Google Books API.
     */
    async function searchBooks() {
        const query = document.getElementById('search-input').value.trim();

        if (query.length === 0) {
            BookSearchModule.clearSuggestions(); // Explicitly call clearSuggestions
            return;
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
            );
            const data = await response.json();
            displaySuggestions(data.items || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    /**
     * Displays suggestions in the suggestion list based on the search results.
     * @param {Array} books - List of books returned from the API.
     */
    function displaySuggestions(books) {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = books
            .slice(0, 5)
            .map((book) => `<li>${book.volumeInfo?.title || 'No title available'}</li>`)
            .join('');
    }

    /**
     * Clears the suggestions list.
     */
    function clearSuggestions() {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
    }

    return {
        init,
        handleEnterPress,
        searchBooks,
        displaySuggestions,
        clearSuggestions,
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookSearchModule;
}
