document.addEventListener('DOMContentLoaded', () => {
  const bookList = document.getElementById('book-list');
  const addBookForm = document.getElementById('add-book-form');
  const editBookForm = document.getElementById('edit-book-form');

  // Fetch and display books
  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const books = await response.json();
    bookList.innerHTML = '';
    books.forEach(book => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = `${book.title} by ${book.author}`;
      const buttonsDiv = document.createElement('div');
      const editButton = document.createElement('button');
      editButton.className = 'btn btn-secondary btn-sm mr-2';
      editButton.textContent = 'Edit';
      editButton.onclick = () => editBook(book);
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger btn-sm';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteBook(book._id);
      buttonsDiv.appendChild(editButton);
      buttonsDiv.appendChild(deleteButton);
      li.appendChild(buttonsDiv);
      bookList.appendChild(li);
    });
  };

  // Add book
  if (addBookForm) {
    addBookForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(addBookForm);
      const book = {
        title: formData.get('title'),
        author: formData.get('author'),
        publishedDate: formData.get('publishedDate'),
      };
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      window.location.href = '/';
    };
  }

  // Edit book
  const editBook = (book) => {
    window.location.href = `edit-book.html?id=${book._id}`;
  };

  if (editBookForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    document.getElementById('book-id').value = bookId;

    fetch(`/api/books/${bookId}`)
      .then(response => response.json())
      .then(book => {
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('publishedDate').value = book.publishedDate.split('T')[0];
      });

    editBookForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(editBookForm);
      const book = {
        title: formData.get('title'),
        author: formData.get('author'),
        publishedDate: formData.get('publishedDate'),
      };
      await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      window.location.href = '/';
    };
  }

  // Delete book
  const deleteBook = async (id) => {
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  fetchBooks();
});