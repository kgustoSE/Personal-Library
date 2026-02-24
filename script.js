let personalLibrary = [];
let activeFilter = 'all';

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

function saveLibrary() {
    localStorage.setItem('my-library', JSON.stringify(personalLibrary));
}

function loadLibrary() {
    const saved = localStorage.getItem('my-library');
    if (!saved) return;
    personalLibrary = JSON.parse(saved);
}

// Grab HTML elements
const form = document.getElementById('add-form');
const bookList = document.getElementById('book-list'); // fixed
const inputTitle = document.getElementById('input-title');
const inputAuthor = document.getElementById('input-author');
const inputNotes = document.getElementById('input-notes');
const inputAudible = document.getElementById('input-audible');
const inputPurchased = document.getElementById('input-purchased');
const inputBorrowed = document.getElementById('input-borrowed');
const inputLib = document.getElementById('input-lib');

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderLibrary();
    });
});

// Submit form
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const genre = document.querySelector('input[name="genre"]:checked').value;
    const read = document.querySelector('input[name="read"]:checked').value;

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

// Render
function renderLibrary() {
    bookList.textContent = '';

    const filtered = personalLibrary.filter(book => {
        if (activeFilter === 'all') return true;
        return book.read === activeFilter;
    });

    if (filtered.length === 0) {
        const emptyContainer = document.createElement('div');
        emptyContainer.className = 'empty-container';

        const gnome = document.createElement('p');
        gnome.className = 'empty-icon';
        gnome.textContent = '🌿 📚 🍄';

        const emptyHeading = document.createElement('h2');
        emptyHeading.className = 'empty-heading';
        emptyHeading.textContent = 'Your shelf is empty...';

        const emptySub = document.createElement('p');
        emptySub.className = 'empty-sub';
        emptySub.textContent = 'The gnomes are waiting to tend to your collection. Add your first book and let the library bloom.';

        const emptyHint = document.createElement('p');
        emptyHint.className = 'empty-hint';
        emptyHint.textContent = '✨ Use the form to plant your first book ✨';

        emptyContainer.appendChild(gnome);
        emptyContainer.appendChild(emptyHeading);
        emptyContainer.appendChild(emptySub);
        emptyContainer.appendChild(emptyHint);
        bookList.appendChild(emptyContainer);
        return;
    }

    filtered.forEach(book => {
        bookList.appendChild(buildCard(book));
    });
}

// Build card
function buildCard(book) {
    const card = document.createElement('div');
    card.className = book.read === 'read' ? 'card card-read' : 'card card-unread';

    const title = document.createElement('p');
    title.textContent = book.title;
    title.className = 'book-title';

    const author = document.createElement('p');
    author.textContent = 'Written By: ' + book.author;
    author.className = 'book-author';

    const notes = document.createElement('p');
    if (book.notes) {
        notes.className = 'book-notes';
        notes.textContent = book.notes;
    }

    const coverWrapper = document.createElement('div');
    coverWrapper.className = 'cover-wrapper';

    const cover = document.createElement('img');
    cover.alt = book.title;
    cover.className = 'book-cover';
    cover.style.width = '50%';
    cover.style.height = '260px';

    const coverText = document.createElement('div');
    coverText.textContent = 'No Cover Found';
    coverText.className = 'cover-placeholder';
    coverText.style.display = 'none';
    coverText.style.width = '60%';
    coverText.style.height = '250px';

    const searchTitle = encodeURIComponent(book.title);
    cover.src = `https://covers.openlibrary.org/b/title/${searchTitle}-L.jpg`;

    cover.addEventListener('load', () => {
        if (cover.naturalWidth <= 1) {
            cover.style.display = 'none';
            coverText.style.display = 'flex';
        }
    });

    cover.addEventListener('error', () => {
        cover.style.display = 'none';
        coverText.style.display = 'flex';
    });

    const badgeRow = document.createElement('div');
    badgeRow.className = 'badge-row';

    const genreBadge = document.createElement('span');
    genreBadge.className = 'badge badge-genre';
    genreBadge.textContent = book.genre === 'fiction' ? '📖 Fiction' : '📊 Non-Fiction';
    badgeRow.appendChild(genreBadge);

    if (book.type.audible) { const b = document.createElement('span'); b.className = 'badge badge-type'; b.textContent = '🎧 Audible'; badgeRow.appendChild(b); }
    if (book.type.purchased) { const b = document.createElement('span'); b.className = 'badge badge-type'; b.textContent = '🛒 Purchased'; badgeRow.appendChild(b); }
    if (book.type.borrowed) { const b = document.createElement('span'); b.className = 'badge badge-type'; b.textContent = '🤝 Borrowed'; badgeRow.appendChild(b); }
    if (book.type.lib) { const b = document.createElement('span'); b.className = 'badge badge-type'; b.textContent = '🏛️ From Library'; badgeRow.appendChild(b); }

    const readBadge = document.createElement('span');
    readBadge.className = book.read === 'read' ? 'badge badge-read' : 'badge badge-unread';
    readBadge.textContent = book.read === 'read' ? '✅ Read' : '❌ Unread';
    readBadge.style.cursor = 'pointer';
    readBadge.addEventListener('click', () => {
        const found = personalLibrary.find(b => b.id === book.id);
        if (found) {
            found.read = found.read === 'read' ? 'unread' : 'read';
            saveLibrary();
            renderLibrary();
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        personalLibrary = personalLibrary.filter(b => b.id !== book.id);
        saveLibrary();
        renderLibrary();
    });

    card.appendChild(readBadge);
    card.appendChild(title);
    coverWrapper.appendChild(cover);
    coverWrapper.appendChild(coverText);
    card.appendChild(coverWrapper);
    card.appendChild(author);
    card.appendChild(badgeRow);
    if (book.notes) card.appendChild(notes);
    card.appendChild(deleteBtn);

    return card;
}

loadLibrary();
renderLibrary();