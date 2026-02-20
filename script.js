// Modifiable Variable Array
let personalLibrary = [];

// Constructor --> Creates the blueprint for what can be placed in our array
// did some research and the moddern class method automatically places the protypeing correctly
class Book {
    constructor(title, author, notes, type, acquired, read) {
        this.id = Date.now();
        this.title = title;
        this.author = author;
        this.notes = notes;
        this.type = type;
        this.acquired = acquired;
        this.read = read;
    }
}


function saveLibrary() {
    localStorage.setItem(`my-library`, JSON.stringify(personalLibrary));
}

function loadLibrary() {
    const saved = localStorage.getItem(`my-library`);
    if (!saved) return;

    personalLibrary = JSON.parse(saved)

}
