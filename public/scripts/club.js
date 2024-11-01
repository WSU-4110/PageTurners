class ProfilePictureChange {
    loadProfilePicture() {
        const savedProfilePic = localStorage.getItem("profilePicture");
        if (savedProfilePic) {
            const profilePic = document.getElementById("club-profile-pic");
            profilePic.src = savedProfilePic; 
        }
    }

    changeProfilePicture(event) {
        const reader = new FileReader();
        const file = event.target.files[0];

        reader.onload = function () {
            const profilePic = document.getElementById("club-profile-pic");
            profilePic.src = reader.result;

            // Image data is saved to the localstorage
            localStorage.setItem("profilePicture", reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

class ChangeProfileAdapter {
    constructor(profilePictureChange) {
        this.profilePictureChange = profilePictureChange; 
    }

    load() {
        this.profilePictureChange.loadProfilePicture();
    }


    update(event) {
        this.profilePictureChange.changeProfilePicture(event);
    }
}

const profilePictureChange = new ProfilePictureChange();
const changeProfileAdapter = new ChangeProfileAdapter(profilePictureChange);

window.onload = function() {
    changeProfileAdapter.load(); // Load profile picture when the page loads
};
