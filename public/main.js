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
      li.dataset.bookId = book._id;

      const statusText = book.available ? 'Available' : 
        `Rented by ${book.rentedBy} (Due: ${new Date(book.dueDate).toLocaleDateString()})`;
      
      li.textContent = `${book.title} by ${book.author} (${book.category}) - ${statusText}`;
      
      // Add overdue warning if applicable
      if (!book.available && new Date(book.dueDate) < new Date()) {
        li.classList.add('bg-danger', 'text-white');
      }
      
      const buttonsDiv = document.createElement('div');
      const editButton = document.createElement('button');
      editButton.className = 'btn btn-secondary btn-sm mr-2';
      editButton.textContent = 'Edit';
      editButton.onclick = () => editBook(book);
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger btn-sm mr-2';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteBook(book._id);
      const rentButton = document.createElement('button');
      rentButton.className = `btn btn-${book.available ? 'success' : 'warning'} btn-sm`;
      rentButton.textContent = book.available ? 'Rent' : 'Return';
      rentButton.onclick = () => book.available ? rentBook(book._id) : returnBook(book._id);
      buttonsDiv.appendChild(editButton);
      buttonsDiv.appendChild(deleteButton);
      buttonsDiv.appendChild(rentButton);
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
        category: formData.get('category'),
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
        document.getElementById('category').value = book.category;
      });

    editBookForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(editBookForm);
      const book = {
        title: formData.get('title'),
        author: formData.get('author'),
        publishedDate: formData.get('publishedDate'),
        category: formData.get('category'),
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
    const confirmed = confirm('Are you sure you want to delete this book?');
    if (confirmed) {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
      fetchBooks();
    }
  };

  // Rent book
  const rentBook = async (id) => {
    const borrowerName = prompt('Enter borrower name:');
    if (!borrowerName) return;
    
    await fetch(`/api/rentals/${id}/rent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ borrowerName }),
    });
    fetchBooks();
  };

  // Return book
  const returnBook = async (id) => {
    await fetch(`/api/rentals/${id}/return`, {
      method: 'POST'
    });
    fetchBooks();
  };

  // Add this function to check for overdue books periodically
  const checkOverdueBooks = async () => {
    const response = await fetch('/api/rentals/overdue');
    const overdueBooks = await response.json();
    
    // Update the UI to show overdue status
    const bookElements = document.querySelectorAll('#book-list li');
    bookElements.forEach(li => {
      const bookId = li.dataset.bookId;
      const isOverdue = overdueBooks.some(book => book._id === bookId);
      if (isOverdue) {
        li.classList.add('bg-danger', 'text-white');
      }
    });
  };

  // Check for overdue books every minute
  setInterval(checkOverdueBooks, 60000);

  fetchBooks();
});