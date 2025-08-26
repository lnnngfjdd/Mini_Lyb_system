import React, { useEffect, useState } from "react";
import axios from "axios";

function BorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [borrowDate, setBorrowDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/borrows/").then(res => setBorrows(res.data));
    axios.get("http://localhost:8000/api/users/").then(res => setUsers(res.data));
    axios.get("http://localhost:8000/api/books/").then(res => setBooks(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/borrows/", {
      user: userId,
      book: bookId,
      borrow_date: borrowDate,
    })
    .then(res => setBorrows([...borrows, res.data]))
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Borrow Records</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <select onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Select Book</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>{book.title}</option>
          ))}
        </select>

        <input
          type="date"
          value={borrowDate}
          onChange={(e) => setBorrowDate(e.target.value)}
          required
        />
        <button type="submit">Add Borrow</button>
      </form>

      <ul>
        {borrows.map(borrow => (
          <li key={borrow.id}>
            User: {borrow.user.name} borrowed {borrow.book.title} on {borrow.borrow_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BorrowsPage;
