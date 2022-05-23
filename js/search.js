document.addEventListener("click", function () {
	const search = document.getElementById("searchBook");

	search.addEventListener("submit", function (e) {
		e.preventDefault();
		searchBookTitle();
	});
});

function searchBookTitle() {
	const input = document.getElementById("searchBookTitle").value.toUpperCase();
	const books = document.getElementsByClassName("book_item");

	for (index of books) {
		const child = index.children[0];
		const title = child.innerText.toUpperCase();

		if (title.includes(input)) {
			index.style.display = "";
		} else {
			index.style.display = "none";
		}
	}
}
