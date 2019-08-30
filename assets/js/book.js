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
  displayStatusMessage('Book has been deleted.', 'info', book);
}

function changeBookReadStatus(book) {

}

function createBookElement(display, book) {
  // Main book container
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('class', 'book-element');
  bookContainer.setAttribute('data-index', myLibrary.indexOf(book));
  bookContainer.style.background = `url('${book.bookImg}') no-repeat`;

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
  iconImage.setAttribute('src', './assets/images/tick.svg');

  elementTemplate.appendChild(iconImage);
  iconOverlay.appendChild(elementTemplate);

  // Icon: Delete Book
  elementTemplate = document.createElement('div');
  elementTemplate.setAttribute('class', 'img-circle');
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

function displayStatusMessage(message, messageType, book) {
  const statusBar = document.getElementById('status-bar');
  if (messageType === 'info') {
    statusBar.style.background = 'lightblue';
    // Display info message
  } else if (messageType === 'caution') {
    // Display caution message
    statusBar.style.background = 'yellow';
  } else if (messageType === 'warning') {
    // Display warning message
    statusBar.style.background = 'red';
  }
  statusBar.classList.add('status-bar-content-show');
  statusBar.innerText = `'${book.title}' has been deleted.`;
  setTimeout(() => {
    statusBar.classList.remove('status-bar-content-show');
    statusBar.innerText = '';
  }, 2000);
}

const myBook1 = new Book('JavaScript The Definitive Guide', 'David Flanagan', 1096, '9780596805524', 5, true, './assets/images/js-definitive-guide.jpeg');
addBookToLibrary(myBook1);
const myBook2 = new Book('The Art of War', 'Sun Tzu', 170, '9781590302255', 1, false, './assets/images/sun-tzu-aow.jpg');
addBookToLibrary(myBook2);
const myBook3 = new Book('Clean Code', 'Robert C. Martin', 701, '9780132350884', 3, false, './assets/images/clean-code-martin.jpg');
addBookToLibrary(myBook3);
const myBook4 = new Book('Why I love my IBMi computer', 'Briggs I. Bi-em', 121, '13123', 2, false, './assets/images/briggs-ibm.png');
addBookToLibrary(myBook4);
const myBook5 = new Book('Good Book', 'Good author', 100, '13123', 5, false);
addBookToLibrary(myBook5);
render();
