import React, { useEffect, useState } from "react";
import axios from "axios";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editingBook, setEditingBook] = useState(null); // Track which book is being edited

  // Fetch books
  const fetchBooks = () => {
    axios
      .get("http://localhost:8001/api/books/")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add or Update Book
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingBook) {
      // Update existing book
      axios
        .put(`http://localhost:8001/api/books/${editingBook._id.$oid || editingBook._id}/`, {
          title,
          author,
        })
        .then(() => {
          setEditingBook(null);
          setTitle("");
          setAuthor("");
          fetchBooks();
        })
        .catch((err) => console.error("Error updating book:", err));
    } else {
      // Add new book
      axios
        .post("http://localhost:8001/api/books/", { title, author })
        .then(() => {
          setTitle("");
          setAuthor("");
          fetchBooks();
        })
        .catch((err) => console.error("Error adding book:", err));
    }
  };

  // Delete Book
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8001/api/books/${id}/`)
      .then(() => fetchBooks())
      .catch((err) => console.error("Error deleting book:", err));
  };

  // Start Editing
  const handleEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
  };

  return (
    <div>
      <h2>Books</h2>

      {/* Book Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit">{editingBook ? "Update Book" : "Add Book"}</button>
        {editingBook && (
          <button
            type="button"
            onClick={() => {
              setEditingBook(null);
              setTitle("");
              setAuthor("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Book List */}
      <ul>
        {books.map((book) => (
          <li key={book._id?.$oid || book._id}>
            {book.title} by {book.author}{" "}
            <button onClick={() => handleEdit(book)}>Edit</button>{" "}
            <button onClick={() => handleDelete(book._id?.$oid || book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BooksPage;
