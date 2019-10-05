'use strict';

const myLibrary = [];

function Book(title, author, pages, ISBN, rating, isRead, bookImg = './assets/images/no-book-cover.png') {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.ISBN = ISBN;
  this.rating = rating;
  this.isRead = isRead;
  this.bookImg = bookImg;

  Book.prototype.info = () => {
    let bookReadMessage = '';
    if (this.isRead) {
      bookReadMessage = 'not read yet';
    } else {
      bookReadMessage = 'had been read';
    }
    return `${this.title} by ${this.author}, ${this.pages} pages, ${bookReadMessage}`;
  };
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function showDeleteDialog(book) {
  let bookElement;
  const bookContainer = document.getElementById('display-books');
  for (let i = 0; i < bookContainer.children.length; i += 1) {
    if (+bookContainer.children[i].getAttribute('data-index') === myLibrary.indexOf(book)) {
      bookElement = bookContainer.children[i];
    }
  }
  const deleteOverlayDiv = bookElement.getElementsByClassName('delete-prompt-overlay');
  deleteOverlayDiv[0].classList.add('delete-overlay-show');
  deleteOverlayDiv[0].style.pointerEvents = 'auto';
}

function hideDeleteDialog(book) {
  let bookElement;
  const bookContainer = document.getElementById('display-books');
  for (let i = 0; i < bookContainer.children.length; i += 1) {
    if (+bookContainer.children[i].getAttribute('data-index') === myLibrary.indexOf(book)) {
      bookElement = bookContainer.children[i];
    }
  }
  const deleteOverlayDiv = bookElement.getElementsByClassName('delete-prompt-overlay');
  deleteOverlayDiv[0].classList.remove('delete-overlay-show');
  deleteOverlayDiv[0].style.pointerEvents = 'none';
}

function deleteBookFromLibrary(book) {
  // Need error checking if the book does not exist for whatever reason.
  //    e.g. do not splice if indexOf = -1
  myLibrary.splice(myLibrary.indexOf(book), 1);
  render();
  displayStatusMessage(`'${book.title}' has been deleted.`, 'info');
}

function changeBookReadStatus(book) {
  let bookElement;
  const bookContainer = document.getElementById('display-books');
  for (let i = 0; i < bookContainer.children.length; i += 1) {
    if (+bookContainer.children[i].getAttribute('data-index') === myLibrary.indexOf(book)) {
      bookElement = bookContainer.children[i];
    }
  }
  const imgContainer = bookElement.getElementsByClassName('img-circle');
  const imgElement = bookElement.getElementsByClassName('img-icon');
  if (book.isRead) {
    imgContainer[0].setAttribute('title', 'Book not read');
    imgElement[0].setAttribute('src', './assets/images/closed-book.svg');
  } else {
    imgContainer[0].setAttribute('title', 'Book read');
    imgElement[0].setAttribute('src', './assets/images/open-book.svg');
  }
  book.isRead = !book.isRead;
}

function createBookElement(display, book) {
  // Main book container
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('class', 'book-element');
  bookContainer.setAttribute('data-index', myLibrary.indexOf(book));

  // Background image container
  const bgImgContainer = document.createElement('img');
  bgImgContainer.setAttribute('class', 'img-bg');
  bgImgContainer.setAttribute('src', book.bookImg);
  bookContainer.appendChild(bgImgContainer);

  // Background image shadow inset
  const bgImgShadowInset = document.createElement('div');
  bgImgShadowInset.setAttribute('class', 'img-bg-inset');
  bookContainer.appendChild(bgImgShadowInset);

  // Overlay on hover
  const bookOverlay = document.createElement('div');
  bookOverlay.setAttribute('class', 'book-overlay');
  bookContainer.appendChild(bookOverlay);

  // Template div to reuse
  let elementTemplate = document.createElement('div');

  // DELETE OVERLAY
  // Delete overlay: Main container
  const deleteOverlay = document.createElement('div');
  deleteOverlay.setAttribute('class', 'delete-prompt-overlay');

  // Delete overlay: Header and Header text
  elementTemplate.setAttribute('class', 'delete-prompt-header');
  let textSpan = document.createElement('span');
  textSpan.setAttribute('class', 'delete-header-text');
  textSpan.innerText = 'DELETE BOOK';
  elementTemplate.appendChild(textSpan);
  deleteOverlay.appendChild(elementTemplate);

  // Delete overlay: Header controls container
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'delete-prompt-controls');

  // Delete overlay: Controls text
  textSpan = document.createElement('span');
  textSpan.setAttribute('class', 'delete-body-text');
  textSpan.innerText = 'Are you sure?';
  elementTemplate.appendChild(textSpan);

  // Icon container
  const deleteControls = document.createElement('div');
  deleteControls.setAttribute('class', 'delete-icon-overlay');

  let iconContainer = document.createElement('div');
  iconContainer.setAttribute('class', 'img-circle');
  iconContainer.addEventListener('click', () => { deleteBookFromLibrary(book); });
  let iconImage = document.createElement('img');
  iconImage.setAttribute('class', 'img-icon');
  iconImage.setAttribute('src', './assets/images/tick.svg');
  iconContainer.appendChild(iconImage);
  deleteControls.appendChild(iconContainer);

  iconContainer = document.createElement('div');
  iconContainer.setAttribute('class', 'img-circle');
  iconContainer.addEventListener('click', () => { hideDeleteDialog(book); });
  iconImage = document.createElement('img');
  iconImage.setAttribute('class', 'img-icon img-icon-cross');
  iconImage.setAttribute('src', './assets/images/cross.svg');
  iconContainer.appendChild(iconImage);
  deleteControls.appendChild(iconContainer);

  // Push controls contents to controls
  elementTemplate.appendChild(deleteControls);
  // Push controls to the delete overlay
  deleteOverlay.appendChild(elementTemplate);
  // Push the Delete overlay
  bookContainer.appendChild(deleteOverlay);
  // END - DELETE OVERLAY

  // Title
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-title');
  elementTemplate.textContent = book.title;
  bookOverlay.appendChild(elementTemplate);

  // Author
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-author');
  elementTemplate.textContent = book.author;
  bookOverlay.appendChild(elementTemplate);

  // Icon overlay container
  const iconOverlay = document.createElement('div');
  iconOverlay.setAttribute('class', 'icon-overlay');

  // Icon: Read Book
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'img-circle');
  elementTemplate.addEventListener('click', () => { changeBookReadStatus(book); });

  iconImage = document.createElement('img');
  iconImage.setAttribute('class', 'img-icon');
  if (book.isRead) {
    iconImage.setAttribute('src', './assets/images/open-book.svg');
    iconImage.setAttribute('alt', 'Book read');
    elementTemplate.setAttribute('title', 'Book read');
  } else {
    iconImage.setAttribute('src', './assets/images/closed-book.svg');
    iconImage.setAttribute('alt', 'Book not read');
    elementTemplate.setAttribute('title', 'Book not read');
  }

  elementTemplate.appendChild(iconImage);
  iconOverlay.appendChild(elementTemplate);

  // Icon: Delete Book
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'img-circle');
  elementTemplate.setAttribute('title', 'Delete Book');
  elementTemplate.addEventListener('click', (e) => { showDeleteDialog(book, e); });

  iconImage = document.createElement('img');
  iconImage.setAttribute('class', 'img-icon');
  iconImage.setAttribute('src', './assets/images/dustbin.svg');
  elementTemplate.appendChild(iconImage);
  iconOverlay.appendChild(elementTemplate);

  // Push icon overlay to main overlay
  bookOverlay.appendChild(iconOverlay);

  // Book info container
  const bookInfoContainer = document.createElement('div');
  bookInfoContainer.setAttribute('class', 'book-info-container');

  // Pages
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-pages-desc');
  elementTemplate.textContent = 'Pages:';
  bookInfoContainer.appendChild(elementTemplate);

  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-pages-value');
  elementTemplate.textContent = book.pages;
  bookInfoContainer.appendChild(elementTemplate);

  // ISBN
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-ISBN-desc');
  elementTemplate.textContent = 'ISBN:';
  bookInfoContainer.appendChild(elementTemplate);

  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-ISBN-value');
  elementTemplate.textContent = book.ISBN;
  bookInfoContainer.appendChild(elementTemplate);

  // Rating
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-rating-desc');
  elementTemplate.textContent = 'Rating: ';
  bookInfoContainer.appendChild(elementTemplate);

  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'book-rating-value');
  elementTemplate.textContent = book.rating;
  bookInfoContainer.appendChild(elementTemplate);

  // Push book info to container
  bookOverlay.appendChild(bookInfoContainer);

  // Push to screen
  display.appendChild(bookContainer);
}

function render() {
  const displayElement = document.getElementById('display-books');
  displayElement.innerHTML = '';
  for (let i = 0; i < myLibrary.length; i += 1) {
    createBookElement(displayElement, myLibrary[i]);
  }
}

function displayStatusMessage(message, messageType) {
  const statusBar = document.getElementById('status-bar');
  const trimColour1 = getComputedStyle(document.documentElement).getPropertyValue('--colour-trim-1');
  if (messageType === 'info') {
    statusBar.style.background = trimColour1;
    // Display info message
  } else if (messageType === 'warning') {
    // Display caution message
    statusBar.style.background = 'yellow';
  } else if (messageType === 'error') {
    // Display warning message
    statusBar.style.background = 'red';
  }
  statusBar.classList.add('status-bar-content-show');
  statusBar.innerText = `${message}`;
  setTimeout(() => {
    statusBar.classList.remove('status-bar-content-show');
    statusBar.innerText = '';
  }, 2000);
}

const addBookBtn = document.getElementById('add-book');
function showBookForm() {
  const bookForm = document.getElementById('add-book-form');
  // IMPORTANT!
  // Need to revert the pointerEvents and display changes
  document.getElementById('form-add-book').noValidate = false;
  bookForm.style.pointerEvents = 'all';
  addBookBtn.style.display = 'none';
  bookForm.classList.add('book-form-show');
}
addBookBtn.addEventListener('click', showBookForm);

const saveBookBtn = document.getElementById('btn-save-book');
function saveBook() {
  const newTitle = document.getElementById('input-book-title').value;
  const newAuthor = document.getElementById('input-book-author').value;
  const newPages = document.getElementById('input-book-pages').value;
  const newISBN = document.getElementById('input-book-ISBN').value;
  const newRating = document.getElementById('input-book-rating').value;
  if (newTitle && newAuthor && newPages && newISBN && newRating) {
    const newBook = new Book(newTitle, newAuthor, newPages, newISBN, newRating, false);
    addBookToLibrary(newBook);
    document.getElementById('input-book-title').value = '';
    document.getElementById('input-book-author').value = '';
    document.getElementById('input-book-pages').value = '';
    document.getElementById('input-book-ISBN').value = '';
    document.getElementById('input-book-rating').value = '';
    hideBookForm();
    displayStatusMessage(`'${newBook.title}' has been saved.`, 'info');
    render();
  } else {
    displayStatusMessage('Error processing your request.', 'error');
  }

}
saveBookBtn.addEventListener('click', saveBook);

const cancelSaveBtn = document.getElementById('btn-cancel-save');
function hideBookForm() {
  const bookForm = document.getElementById('add-book-form');
  document.getElementById('form-add-book').noValidate = true;
  bookForm.style.pointerEvents = 'none';
  addBookBtn.style.display = 'flex';
  bookForm.classList.remove('book-form-show');
}
function clearInputFields() {
  const inputs = document.querySelectorAll('input');
  
  inputs.forEach( input => {
    input.value = "";
  });
};

cancelSaveBtn.addEventListener('click', () => {
  hideBookForm();
  clearInputFields();
});

const myBook1 = new Book('JavaScript The Definitive Guide', 'David Flanagan', 1096, '9780596805524', 4, true, './assets/images/js-definitive-guide.png');
addBookToLibrary(myBook1);
const myBook2 = new Book('The Art of War', 'Sun Tzu', 170, '9781590302255', 4, false, './assets/images/sun-tzu-aow.jpg');
addBookToLibrary(myBook2);
const myBook3 = new Book('Clean Code', 'Robert C. Martin', 701, '9780132350884', 5, true, './assets/images/clean-code-martin.jpg');
addBookToLibrary(myBook3);
const myBook4 = new Book('Why I love IBMi', 'Briggs I. Bi-em', 121, '1312398765432', 5, true, './assets/images/briggs-ibm.png');
addBookToLibrary(myBook4);
const myBook5 = new Book('Unknown Book', 'Unknown Author', 100, '3789654113123', 5, false);
addBookToLibrary(myBook5);

// prevent page refresh
document.getElementById('form-add-book').addEventListener('submit', (e) => {
  e.preventDefault();
});

render();
