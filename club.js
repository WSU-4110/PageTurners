class CreatingProfilePicture {
  constructor() {
    if (CreatingProfilePicture.instance) {
      return CreatingProfilePicture.instance;
    }

    CreatingProfilePicture.instance = this;
  }

  loadProfilePicture() {
    const savedProfilePic = localStorage.getItem("profilePicture");
    if (savedProfilePic) {
      document.getElementById("club-profile-pic").src = savedProfilePic;
    }
  }

  changeProfilePicture(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = () => {
      const profilePic = document.getElementById("club-profile-pic");
      profilePic.src = reader.result;

      localStorage.setItem("profilePicture", reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}

// Singleton instance
const CreatingProfilePicture = new CreatingProfilePicture();
window.onload = () => CreatingProfilePicture.loadProfilePicture();
