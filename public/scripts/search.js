const apiKey = 'AIzaSyA-QEgCdTmslsgP14eqrkYOB3CxNRcT-eE';

// Check if the search input exists
if (document.getElementById('search-input')) {
    const searchInput = document.getElementById('search-input');
    const suggestionsList = document.getElementById('suggestions-list');

    // Trigger searchBooks when user types
    searchInput.addEventListener('input', searchBooks);

    // Handle 'Enter' press to navigate to the results page
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default action
            const query = searchInput.value.trim();
            if (query.length > 0) {
                // Redirect to results.html with the search query in the URL
                window.location.href = `results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Fetch book suggestions from Google Books API as user types
    async function searchBooks() {
        const query = searchInput.value.trim();

        // Only search if input is at least 3 characters long
        if (query.length < 3) {
            suggestionsList.innerHTML = ''; // Clear suggestions
            return;
        }

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
            const data = await response.json();
            displaySuggestions(data.items); // Display suggestions
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // Display search suggestions
    function displaySuggestions(books) {
        suggestionsList.innerHTML = ''; // Clear previous suggestions

        if (!books) return;

        books.slice(0, 5).forEach(book => {
            const suggestion = document.createElement('li');
            const title = book.volumeInfo.title || 'No title';
            const thumbnail = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/40x60'; // Default image

            // Create suggestion item
            suggestion.className = 'suggestion-item';
            suggestion.innerHTML = `<img src="${thumbnail}" alt="Book Cover"><div><strong>${title}</strong></div>`;

            // Add click event to fill input when suggestion is clicked
            suggestion.onclick = () => {
                searchInput.value = title; // Fill input with title
                suggestionsList.innerHTML = ''; // Clear suggestions
            };

            // Add suggestion list
            suggestionsList.appendChild(suggestion);
        });
    }
}

// Check if on results.html to fetch and display the full search results
if (window.location.pathname.includes('results.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q'); // Get the 'q' parameter from the URL

    if (searchQuery) {
        // Display search query at the top of the page
        document.getElementById('search-query').textContent = `${searchQuery}`;

        // Fetch and display the search results
        fetchSearchResults(searchQuery);
    } else {
        // Handle case where no query was provided
        document.getElementById('search-query').textContent = 'No search query provided.';
    }
}

// Fetch books from Google Books API based on the query
async function fetchSearchResults(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
        const data = await response.json();
        displayResults(data.items); // Display the results on the page
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Display full book results on the page
function displayResults(books) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // Clear previous results

    if (!books || books.length === 0) {
        resultsList.innerHTML = '<p>No results found</p>';
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('result-item');
        
        const title = book.volumeInfo.title || 'No title';
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown author';
        const thumbnail = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192';
        const description = book.volumeInfo.description || 'No description available';
        const averageRating = book.volumeInfo.averageRating || 'N/A'; // Get the rating
        const ratingsCount = book.volumeInfo.ratingsCount || 0; // Get the number of ratings

        // Generate the stars for the rating
        const ratingStars = generateStarRating(averageRating);

        // Create result item
        bookItem.innerHTML = `
            <img src="${thumbnail}" alt="Book Cover">
            <h3>${title}</h3>
            <p>by ${author}</p>
            <p>${description.slice(0, 100)}...</p>
             <p>Rating: ${ratingStars} (from ${ratingsCount} rating(s))</p>
        `;

        resultsList.appendChild(bookItem);
    });
    // Function to generate star ratings
function generateStarRating(rating) {
    if (rating === 'N/A') return 'No ratings'; // No rating available

    const maxStars = 5;
    let stars = '';

    // Round the rating to the nearest half-star
    const roundedRating = Math.round(rating * 2) / 2;

    // Add full stars
    for (let i = 0; i < Math.floor(roundedRating); i++) {
        stars += '⭐'; // Full star emoji
    }

    // Add half star if needed
    if (roundedRating % 1 !== 0) {
        stars += '✨'; // Half star emoji
    }

    // Add empty stars
    for (let i = Math.ceil(roundedRating); i < maxStars; i++) {
        stars += '☆'; // Empty star emoji
    }

    return stars;
}
}
