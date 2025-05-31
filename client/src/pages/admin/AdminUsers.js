"use client"

import { useState, useEffect } from "react"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  // For demo purposes, we'll create some sample users
  useEffect(() => {
    const fetchUsers = () => {
      try {
        // In a real app, this would be an API call
        const sampleUsers = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "9876543210",
            status: "active",
            rides: 15,
            joinedAt: "2023-01-15T10:30:00Z",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "9876543211",
            status: "active",
            rides: 8,
            joinedAt: "2023-02-20T14:45:00Z",
          },
          {
            id: "3",
            name: "Robert Johnson",
            email: "robert@example.com",
            phone: "9876543212",
            status: "blocked",
            rides: 3,
            joinedAt: "2023-03-10T09:15:00Z",
          },
          {
            id: "4",
            name: "Emily Davis",
            email: "emily@example.com",
            phone: "9876543213",
            status: "active",
            rides: 22,
            joinedAt: "2022-11-05T16:20:00Z",
          },
          {
            id: "5",
            name: "Michael Wilson",
            email: "michael@example.com",
            phone: "9876543214",
            status: "inactive",
            rides: 0,
            joinedAt: "2023-04-25T11:00:00Z",
          },
        ]

        setUsers(sampleUsers)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.password) {
      setError("Please fill all fields")
      return
    }

    // Add new user
    const newId = (users.length + 1).toString()
    const userToAdd = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      status: "active",
      rides: 0,
      joinedAt: new Date().toISOString(),
    }

    setUsers([...users, userToAdd])
    setShowAddModal(false)
    setNewUser({
      name: "",
      email: "",
      phone: "",
      password: "",
    })
  }

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleBlockUser = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "blocked" ? "active" : "blocked" } : user,
      ),
    )
  }

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h2>Manage Users</h2>
        <div className="admin-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add New User
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Rides</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  </td>
                  <td>{user.rides}</td>
                  <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit-btn" title="Edit User">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="action-btn block-btn"
                      title={user.status === "blocked" ? "Unblock User" : "Block User"}
                      onClick={() => handleBlockUser(user.id)}
                    >
                      {user.status === "blocked" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                      )}
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
