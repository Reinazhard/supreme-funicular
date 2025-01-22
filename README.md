# Library System

A simple CRUD application for a book renting system using MongoDB, Express, and a web interface.

## Project Structure

```
library-system/
├── .env
├── .gitignore
├── models/
│   └── Book.js
├── package.json
├── public/
│   ├── add-book.html
│   ├── edit-book.html
│   ├── index.html
│   └── main.js
├── routes/
│   └── books.js
└── server.js
```

## Prerequisites

- Node.js
- MongoDB

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Create a `.env` file in the root of the project with the following content:**
   ```env
   PORT=<your desired port>
   MONGO_URI=<your MongoDB URI> # Make sure you have MongoDB running
   ```

3. **Run the server:**
   ```sh
   npx nodemon server.js
   ```

4. **Access the application:**
   Open your browser and go to `http://localhost:<port>`.

## Usage

- **Add a Book:**
  - Navigate to `http://localhost:<port>/add-book.html`
  - Fill in the book details and click "Add Book"

- **Edit a Book:**
  - On the main page, click the "Edit" button next to a book
  - Update the book details and click "Update Book"

- **Delete a Book:**
  - On the main page, click the "Delete" button next to a book

## License

This project is licensed under the MIT License.
