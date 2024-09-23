/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */
function generateId() {
  return Date.now().toString();
}

// retrieve images
export function getImages() {
  const images = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("image_")) {
      const image = JSON.parse(localStorage.getItem(key));
      images.push(image);
    }
  }
  const sortedImages = images.sort((a, b) => b.date_p - a.date_p);
  return sortedImages;
}

// retrieve comments
export function getComments() {
  const comments = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`comment_`)) {
      const comment = JSON.parse(localStorage.getItem(key));
      comments.push(comment);
    }
  }
  const sortedComments = comments.sort((a, b) => b.date_p - a.date_p);
  return sortedComments;
}

export function getSpecificComments(id) {
  const comments = getComments();
  let specific = [];
  for (let c of comments) {
    if (c.imageId == id) {
      specific.push(c);
    }
  }
  return specific;
}

// add an image to the gallery
export function addImage(title, author, url) {
  const imageId = generateId();
  const date_p = new Date();
  const date =
    date_p.getDate().toString() +
    "/" +
    (date_p.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    date_p.getFullYear().toString();
  const image = { imageId, title, author, url, date_p, date };
  localStorage.setItem(`image_${imageId}`, JSON.stringify(image));
  return image;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
  localStorage.removeItem(`image_${imageId}`);
}

// add a comment to an image
export function addComment(imageId, author, content) {
  const commentId = generateId();
  const date_p = new Date();
  const date =
    date_p.getDate().toString() +
    "/" +
    (date_p.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    date_p.getFullYear().toString();
  const comment = { commentId, imageId, author, content, date_p, date };
  localStorage.setItem(`comment_${commentId}`, JSON.stringify(comment));
  return comment;
}

// delete a comment to an image
export function deleteComment(commentId) {
  localStorage.removeItem(`comment_${commentId}`);
}
