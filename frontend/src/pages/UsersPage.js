import React, { useEffect, useState } from "react";
import axios from "axios";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member"); // default role

  // Load all users
  const fetchUsers = () => {
    axios.get("http://localhost:8003/api/users/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8003/api/users/", {
      name,
      email,
      role,
    })
    .then(() => {
      setName("");
      setEmail("");
      setRole("member");
      fetchUsers(); // refresh list
    })
    .catch(err => console.error("Error adding user:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      {/* User Form */}
      <form onSubmit={handleAddUser} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {/* User List */}
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} ({user.role}) - {user.email}</li>
        ))}
      </ul>

    </div>
  );
}

export default UsersPage;
