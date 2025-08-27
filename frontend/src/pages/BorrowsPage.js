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
    // fetch enriched borrows from orchestrator
    axios.get("http://localhost:8002/api/borrow-orchestrator/")
      .then(res => {
        console.log("Fetched borrows:", res.data);
        setBorrows(res.data);
      })
      .catch(err => console.error("Error fetching borrows:", err));

    // fetch users
    axios.get("http://localhost:8003/api/users/")
      .then(res => {
        console.log("Fetched users:", res.data);
        setUsers(res.data);
      })
      .catch(err => console.error("Error fetching users:", err));

    // fetch books
    axios.get("http://localhost:8001/api/books/")
      .then(res => {
        console.log("Fetched books:", res.data);
        setBooks(res.data);
      })
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting borrow with:", {
      user: userId,
      book: bookId,
      borrow_date: borrowDate,
    });

    // send request to orchestrator (not raw CRUD)
    axios.post("http://localhost:8002/api/borrow-orchestrator/", {
      user: userId,
      book: bookId,
      borrow_date: borrowDate,
    })
    .then(res => {
      console.log("Borrow created:", res.data);
      setBorrows([...borrows, res.data]); // append enriched borrow
    })
    .catch(err => {
      console.error("Error creating borrow:", err.response ? err.response.data : err);
    });
  };

  return (
    <div>
      <h2>Borrow Records</h2>
      <form onSubmit={handleSubmit}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
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
            User: {borrow.user?.name} borrowed {borrow.book?.title} on {borrow.borrow_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BorrowsPage;
