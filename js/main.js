const books = [];
const printBook = "print-books";
const webStorage = "books-web-storage";

document.addEventListener("DOMContentLoaded", function () {
	const submitForm = document.getElementById("inputBook");

	submitForm.addEventListener("submit", function (e) {
		e.preventDefault();
		addBook();
	});

	loadBook();
});

document.addEventListener(printBook, function () {
	// console.log(books);
	const incompleteRead = document.getElementById("incompleteBookshelfList");
	incompleteRead.innerHTML = "";

	const completeRead = document.getElementById("completeBookshelfList");
	completeRead.innerHTML = "";

	for (bookItem of books) {
		const bookElement = createBook(bookItem);

		if (bookItem.isComplete != true) {
			incompleteRead.append(bookElement);
		} else {
			completeRead.append(bookElement);
		}
	}
});

function objectBook(id, book, author, year, isComplete) {
	return {
		id,
		book,
		author,
		year,
		isComplete
	};
}

function addBook() {
	const bookId = +new Date();
	const bookTitle = document.getElementById("inputBookTitle").value;
	const bookAuthor = document.getElementById("inputBookAuthor").value;
	const bookYear = document.getElementById("inputBookYear").value;
	const isCompleted = document.getElementById("inputBookIsComplete");

	const bookYearInt = parseInt(bookYear);

	if (isCompleted.checked != true) {
		const getObject = objectBook(bookId, bookTitle, bookAuthor, bookYearInt, false);
		books.push(getObject);
	} else {
		const getObject = objectBook(bookId, bookTitle, bookAuthor, bookYearInt, true);
		books.push(getObject);
	}

	document.dispatchEvent(new Event(printBook));
	saveBook();
}

function createBook(data) {
	const textTitle = document.createElement("h3");
	textTitle.innerText = data.book;

	const textAuthor = document.createElement("p");
	textAuthor.innerText = "Penulis : " + data.author;

	const textYear = document.createElement("p");
	textYear.innerText = "Tahun : " + data.year;

	const done = document.createElement("button");
	done.classList.add("green");

	if (data.isComplete != true) {
		done.innerText = "Selesai dibaca";
		done.addEventListener("click", function () {
			const readBook = findBook(data.id);
			if (readBook == null) {
				return;
			}
			readBook.isComplete = true;
			document.dispatchEvent(new Event(printBook));
			saveBook();
		});
	} else {
		done.innerText = "Belum selesai dibaca";
		done.addEventListener("click", function () {
			const unreadBook = findBook(data.id);

			if (unreadBook == null) {
				return;
			}

			unreadBook.isComplete = false;
			document.dispatchEvent(new Event(printBook));
			saveBook();
		});
	}

	const erase = document.createElement("button");
	erase.classList.add("red");
	erase.innerText = "Hapus Buku";

	erase.addEventListener("click", function () {
		if (confirm("Hapus buku " + data.book + " ?") == true) {
			const erase = findBookId(data.id);

			if (erase === -1) {
				return;
			}
			books.splice(erase, 1);

			document.dispatchEvent(new Event(printBook));
			saveBook();
		} else {
			return;
		}
	});

	const isBook = document.createElement("div");
	isBook.classList.add("action");
	isBook.append(done, erase);

	const bookshelf = document.createElement("article");
	bookshelf.classList.add("book_item");
	bookshelf.append(textTitle, textAuthor, textYear, isBook);
	bookshelf.setAttribute("id", data.id);

	return bookshelf;
}

function findBook(bookId) {
	for (bookItem of books) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}
	return null;
}

function findBookId(bookId) {
	for (index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}
	return -1;
}

// Web Storage

function saveBook() {
	const parsed = JSON.stringify(books);
	localStorage.setItem(webStorage, parsed);

	document.dispatchEvent(new Event(printBook));
}

function loadBook() {
	const loadData = localStorage.getItem(webStorage);

	let bookData = JSON.parse(loadData);

	if (bookData !== null) {
		for (data of bookData) {
			books.push(data);
		}
	}

	document.dispatchEvent(new Event(printBook));
}
