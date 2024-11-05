// Function to handle the profile picture change
function changeProfilePicture(event) {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onload = function () {
    const profilePic = document.getElementById("club-profile-pic");
    profilePic.src = reader.result;

    // Save the image data to localStorage
    localStorage.setItem("profilePicture", reader.result);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Function to load the profile picture from localStorage on page load
function loadProfilePicture() {
  const savedProfilePic = localStorage.getItem("profilePicture");
  if (savedProfilePic) {
    document.getElementById("club-profile-pic").src = savedProfilePic;
  }
}

// Load the profile picture when the page is loaded
window.onload = loadProfilePicture;


