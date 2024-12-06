import fileApi from "file-api";
const { FileReader } = fileApi;

import fetch from "node-fetch";
global.fetch = fetch;

// import { changeProfilePicture } from "/Users/temmy/Desktop/PageTurners/PageTurners/project.js";

// In project.spec.js
import {
  changeImage,
  toggleSearch,
  fetchFeaturedBooks,
  fetchTopRecommendations,
  loadProfilePicture,
  changeBackgroundColor,
} from "/Users/temmy/Desktop/PageTurners/PageTurners/project.js";

global.FileReader = FileReader;

describe("Unit Testing", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <img id="carousel-image" src=""/>
      <input id="search-input" style="display: none;" />
      <div id="recommendations-container"></div>
      <div id="featured-books-container"></div>
      <img id="club-profile-pic" src=""/>
    `;
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake((key) => {
      if (key === "profilePicture") return "data:image/png;base64,dummydata";
      return null;
    });
  });

  // Test method changeImage
  describe("changeImage", () => {
    it("should update the carousel image src to the correct URL", () => {
      const images = [
        "../../images/first1.png",
        "../../images/second2.jpg",
        "../../images/third3.jpg",
      ];
      changeImage(1);
      const carouselImage = document.getElementById("carousel-image");
      expect(carouselImage.src).toContain(images[0]);
    });
  });

  // Test method toggleSearch()
  describe("toggleSearch", () => {
    it("should display and focus the search input if initially hidden", () => {
      toggleSearch();
      const searchInput = document.getElementById("search-input");
      expect(searchInput.style.display).toBe("block");
      expect(searchInput.style.width).toBe("200px");
    });

    it("should hide the search input if already displayed", () => {
      const searchInput = document.getElementById("search-input");
      searchInput.style.display = "block";
      toggleSearch();
      expect(searchInput.style.display).toBe("none");
    });
  });

  // Test method fetchTopRecommendations
  describe("fetchTopRecommendations", () => {
    it("should fetch and render top recommendations", async () => {
      spyOn(global, "fetch").and.returnValue(
        Promise.resolve({
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: "1",
                  volumeInfo: { imageLinks: { thumbnail: "img1.jpg" } },
                },
              ],
            }),
        })
      );

      await fetchTopRecommendations();
      const recommendationsContainer = document.getElementById(
        "recommendations-container"
      );
      expect(recommendationsContainer.innerHTML).toContain("img1.jpg");
    });
  });

  // Test method fetchFeaturedBooks
  describe("fetchFeaturedBooks", () => {
    it("should fetch and render featured books", async () => {
      spyOn(global, "fetch").and.returnValue(
        Promise.resolve({
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: "2",
                  volumeInfo: { imageLinks: { thumbnail: "img2.jpg" } },
                },
              ],
            }),
        })
      );

      await fetchFeaturedBooks();
      const featuredBooksContainer = document.getElementById(
        "featured-books-container"
      );
      expect(featuredBooksContainer.innerHTML).toContain("img2.jpg");
    });
  });

  // Test method loadProfilePicture()
  describe("loadProfilePicture", () => {
    it("should load the profile picture from localStorage", () => {
      loadProfilePicture();
      const profilePic = document.getElementById("club-profile-pic");
      expect(profilePic.src).toBe("data:image/png;base64,dummydata");
    });
  });

  // Test method changeBackgroundColor
  describe("changeBackgroundColor", () => {
    it("should change the background color of the body", () => {
      changeBackgroundColor("blue");
      expect(document.body.style.backgroundColor).toBe("blue");

      changeBackgroundColor("red");
      expect(document.body.style.backgroundColor).toBe("red");
    });
  });
});
