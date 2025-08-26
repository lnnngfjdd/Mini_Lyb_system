import React, { useEffect, useState } from "react";
import axios from "axios";

function BorrowsPage() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/borrows/")
      .then(res => setBorrows(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Borrow Records</h2>
      <ul>
        {borrows.map(borrow => (
          <li key={borrow.id}>
            User: {borrow.user} borrowed {borrow.book} on {borrow.borrow_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BorrowsPage;
