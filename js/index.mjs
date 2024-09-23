import {
  getImages,
  getComments,
  addImage,
  deleteImage,
  addComment,
  deleteComment,
  getSpecificComments,
} from "./api.mjs";

let images = [];
let comments = [];
let i_images = 0;
let i_comments_page = 0;

// Load images on page load
window.addEventListener("DOMContentLoaded", function () {
  images = getImages();
  if (images.length > 0) {
    switchImage(0);
  } else {
    hideImageContainer();
  }
});

// Toggle new image form
document.addEventListener("DOMContentLoaded", () => {
  const toggleFormButton = document.getElementById("toggle_form");
  const imageForm = document.getElementById("new_image_form");

  toggleFormButton.addEventListener("click", () => {
    imageForm.style.display =
      imageForm.style.display === "none" ? "flex" : "none";
  });
});

// Create new image registry
document
  .getElementById("new_image_form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("new_image_title").value;
    const author = document.getElementById("new_image_author").value;
    const url = document.getElementById("new_image_url").value;

    if (title && author && url) {
      document.getElementById("new_image_form").reset();
      const image = addImage(title, author, url);
      images.push(image);
      displayImage(image);
      showImageContainer();
    }
  });

// Switch image
function switchImage(num) {
  i_images += num;
  if (i_images < 0) {
    i_images = images.length - 1;
  } else if (i_images >= images.length) {
    i_images = 0;
  }
  displayImage(images[i_images]);
  comments = []; // Clear comments for the new image
  clearComments(); // Clear the displayed comments
  displayCommentsByImage();
}

// Clear displayed comments
function clearComments() {
  document.getElementById("comments").innerHTML = "";
}

// Show comments for the current image
function displayCommentsByImage() {
  comments = getSpecificComments(images[i_images].imageId);
  comments.sort((a, b) => b.date - a.date);
  displayMultipleComments(0);
}

// Delete image
function removeImage() {
  deleteImage(images[i_images].imageId);
  images.splice(i_images, 1);
  if (images.length > 0) {
    switchImage(0);
  } else {
    hideImageContainer();
  }
}

// Show image container
function showImageContainer() {
  document.querySelector(".image_container").style.display = "flex";
}

// Hide image container
function hideImageContainer() {
  document.querySelector(".image_container").style.display = "none";
}

// Display image
function displayImage(image) {
  const element = document.getElementById("current_image");
  element.className = "current_image";
  element.innerHTML = `
      <header>${image.title}</header>
      <div class="content_row">
          <div class="text">${image.author}</div>
          <button class="delete" id="delete"></button>
      </div>
      <img src="${image.url}" class="image" />
      <div class="content_row">
          <button class="previous" id="previous_image"></button>
          <div class="text">${image.date}</div>
          <button class="next" id="next_image"></button>
      </div>`;

  document.getElementById("previous_image").addEventListener("click", () => {
    switchImage(-1);
  });

  document.getElementById("next_image").addEventListener("click", () => {
    switchImage(1);
  });

  document.getElementById("delete").addEventListener("click", () => {
    removeImage();
  });
}

// Create new comment registry
document
  .getElementById("comment_form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const author = document.getElementById("c_author").value;
    const content = document.getElementById("c_para").value;
    if (author && content) {
      document.getElementById("comment_form").reset();
      const comment = addComment(images[i_images].imageId, author, content);
      comments.push(comment);
      comments.sort((a, b) => new Date(b.date_P) - new Date(a.date));
      displayMultipleComments(0);
    }
  });

// Delete comment
function removeComment(commentId) {
  const commentIndex = comments.findIndex((c) => c.commentId === commentId);
  if (commentIndex !== -1) {
    deleteComment(commentId);
    comments.splice(commentIndex, 1);
    displayMultipleComments(0);
  }
}

// Display one comment
function displayComment(comment) {
  const cmt = document.createElement("div");
  cmt.className = "comment";
  cmt.dataset.id = comment.commentId;
  cmt.innerHTML = `
  <div class="content_row">
    <div class="author">${comment.author}</div>
    <div class="date">${comment.date}</div>
    <button id="delete_${comment.commentId}" class="delete"></button>
  </div>
  <p class="long_text">${comment.content}</p>`;
  document.getElementById("comments").prepend(cmt);

  document
    .getElementById(`delete_${comment.commentId}`)
    .addEventListener("click", () => {
      removeComment(comment.commentId);
    });
}

// Display multiple comments
function displayMultipleComments(num) {
  const newPageIndex = i_comments_page + num;
  const totalPages = Math.ceil(comments.length / 10);

  if (newPageIndex >= 0 && newPageIndex < totalPages) {
    i_comments_page = newPageIndex;

    const startIndex = i_comments_page * 10;
    const endIndex = startIndex + 10;

    document.getElementById("comments").innerHTML = "";

    for (let i = startIndex; i < endIndex; i++) {
      if (i < comments.length) {
        displayComment(comments[i]);
      }
    }
  }
}

document.getElementById("previous_comments").addEventListener("click", (e) => {
  e.preventDefault();
  displayMultipleComments(-1);
});

document.getElementById("next_comments").addEventListener("click", (e) => {
  e.preventDefault();
  displayMultipleComments(1);
});
