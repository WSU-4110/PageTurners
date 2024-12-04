// Array of carousel images
const images = [
  "../../images/first1.png",
  "../../images/second2.jpg",
  "../../images/third3.jpg",
  "../../images/fourth4.webp",
  "../../images/fifth5.jpg",
  "../../images/sixth6.jpg",
  "../../images/seventh7.jpeg",
  "../../images/eigth8.jpg",
  "../../images/ninth9.jpg",
  "../../images/tenth10.jpg",
];

// Function to change the carousel image
window.changeImage = function(index) {
  document.getElementById("carousel-image").src = images[index - 1];
};

// Function to toggle search input visibility
window.toggleSearch = function() {
  const searchInput = document.getElementById("search-input");
  if (searchInput.style.display === "none" || !searchInput.style.display) {
    searchInput.style.display = "block";
    searchInput.style.width = "200px";
  } else {
    searchInput.style.display = "none";
  }
};

// Function to fetch and display top book recommendations
window.fetchTopRecommendations = async function() {
  const API_KEY = "YOUR_GOOGLE_BOOKS_API_KEY"; // Replace with your actual API key
  const API_URL = `https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=3&key=${API_KEY}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const recommendationsContainer = document.getElementById("recommendations-container");
    recommendationsContainer.innerHTML = ""; // Clear previous content

    if (data.items) {
      data.items.slice(0, 3).forEach((book, index) => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("recommendation-item");

        const number = document.createElement("span");
        number.classList.add("number");
        number.textContent = index + 1;

        const link = document.createElement("a");
        link.href = `https://books.google.com/books?id=${book.id}`;
        link.target = "_blank"; // Open in a new tab

        const image = document.createElement("img");
        image.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "../../images/placeholder.jpg";
        image.alt = book.volumeInfo.title;

        link.appendChild(image);
        bookItem.appendChild(number);
        bookItem.appendChild(link);
        recommendationsContainer.appendChild(bookItem);
      });
    } else {
      console.log("No items found in the response.");
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
  }
};

// Function to fetch and display featured books
window.fetchFeaturedBooks = async function() {
  const API_KEY = "YOUR_GOOGLE_BOOKS_API_KEY"; // Replace with your actual API key
  const API_URL = `https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=10&key=${API_KEY}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const featuredBooksContainer = document.getElementById("featured-books-container");
    featuredBooksContainer.innerHTML = ""; // Clear previous content

    if (data.items) {
      data.items.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        const link = document.createElement("a");
        link.href = `https://books.google.com/books?id=${book.id}`;
        link.target = "_blank"; // Open in a new tab

        const image = document.createElement("img");
        image.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "../../images/placeholder.jpg";
        image.alt = book.volumeInfo.title;

        link.appendChild(image);
        bookCard.appendChild(link);
        featuredBooksContainer.appendChild(bookCard);
      });
    } else {
      console.log("No items found in the response.");
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// Function to handle the profile picture change
window.changeProfilePicture = function(event) {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onload = function() {
    const profilePic = document.getElementById("club-profile-pic");
    profilePic.src = reader.result;

    // Save the image data to localStorage
    localStorage.setItem("profilePicture", reader.result);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

// Function to load the profile picture from localStorage on page load
window.loadProfilePicture = function() {
  const savedProfilePic = localStorage.getItem("profilePicture");
  if (savedProfilePic) {
    document.getElementById("club-profile-pic").src = savedProfilePic;
  }
};

window.changeBackgroundColor = function(color) {
  document.body.style.backgroundColor = color;
};

// Load the profile picture when the page is loaded
window.onload = loadProfilePicture;

// Fetch initial data for the dashboard
window.fetchTopRecommendations();
window.fetchFeaturedBooks();
