import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import BooksPage from "./pages/BooksPage";
import BorrowsPage from "./pages/BorrowsPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/users">Users</Link> |{" "}
        <Link to="/books">Books</Link> |{" "}
        <Link to="/borrows">Borrows</Link>
      </nav>

      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/borrows" element={<BorrowsPage />} />
      </Routes>
    </div>
  );
}

export default App;
