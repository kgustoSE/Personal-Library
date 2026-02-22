// Modifiable Variable Array
let personalLibrary = [];

// Constructor --> Creates the blueprint for what can be placed in our array
// did some research and the moddern class method automatically places the protypeing correctly
class Book {
    constructor(title, author, genre, notes, audible, purchased, borrowed, lib, read) {
        this.id = Date.now();
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.notes = notes;
        this.type = { audible, purchased, borrowed, lib };
        this.read = read;
    }
}

// Save -- Load Functions
function saveLibrary() {
    localStorage.setItem(`my-library`, JSON.stringify(personalLibrary));
}

function loadLibrary() {
    const saved = localStorage.getItem(`my-library`);
    if (!saved) return;

    personalLibrary = JSON.parse(saved)

}

// Grab HTML elements

const form = document.getElementById(`add-form`);
const bookList = document.getElementById(`library-container`);
const inputTitle = document.getElementById(`input-title`);
const inputAuthor = document.getElementById(`input-author`);
const inputNotes = document.getElementById(`input-notes`);
const inputAudible = document.getElementById('input-audible');
const inputPurchased = document.getElementById('input-purchased');
const inputBorrowed = document.getElementById('input-borrowed');
const inputLib = document.getElementById('input-lib');

// submit form

form.addEventListener(`submit`, (event) => {
    event.preventDefault();

    const genre = document.querySelector(`input[name="genre"]:checked`).value;
    const read = document.querySelector(`input[name="read"]:checked`).value;

    const newBook = new Book(
        inputTitle.value.trim(),
        inputAuthor.value.trim(),
        genre,
        inputNotes.value.trim(),
        inputAudible.checked,
        inputPurchased.checked,
        inputBorrowed.checked,
        inputLib.checked,
        read
    );

    personalLibrary.push(newBook);
    saveLibrary();
    renderLibrary();
    form.reset();
});

// render the library to build the cards

function renderLibrary() {
    bookList.textContent = ``;

    if (personalLibrary.length === 0) {
        const emptyContainer = document.createElement(`div`);
        emptyContainer.className = `empty-container`;

        const gnome = document.createElement(`p`);
        gnome.className = `empty-icon`;
        gnome.textContent = '🌿 📚 🍄';

        const emptyHeading = document.createElement(`h2`);
        emptyHeading.className = `empty-heading`;
        emptyHeading.textContent = `Your shelf is empty...`;

        const emptySub = document.createElement(`p`);
        emptySub.className = `empty-sub`;
        emptySub.textContent = `The gnomes are waiting to tend your collection. Add your first book and let the library bloom.`;

        const emptyHint = document.createElement(`p`);
        emptyHint.className = `empty-hint`;
        emptyHint.textContent = `✨ Use the form to plant your first book ✨`

        emptyContainer.appendChild(gnome);
        emptyContainer.appendChild(emptyHeading);
        emptyContainer.appendChild(emptySub);
        emptyContainer.appendChild(emptyHint);
        bookList.appendChild(emptyContainer);
        return;

    }
}
renderLibrary();