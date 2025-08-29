import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, XCircle, UserCheck, UserX, UserPlus, UserMinus, Search } from "lucide-react";
import { apiService } from "../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.users.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to retrieve users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      fetchUsers();
      return;
    }
    try {
      setLoading(true);
      const response = await apiService.users.searchUsersByName(searchTerm);
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to search users:", err);
      setError("Failed to search for users.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async ({ user }) => {
    const newStatus = user.user_status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    console.log({ ...user, user_status: newStatus });
    try {
      // Corrected: Send the full user object with the updated status
      await apiService.users.updateUser(user.user_id, { ...user, user_status: newStatus });
      
      setUsers(users.map(u => u.user_id === user.user_id ? { ...u, user_status: newStatus } : u));
      alert(`User status successfully changed to ${newStatus}.`);
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert("Failed to change user status.");
    }
  };

  const handleToggleRole = async ({ user }) => {
    const newRole = user.user_role === "ADMIN" ? "USER" : "ADMIN";
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        // Corrected: Send the full user object with the updated role
        await apiService.users.updateUser(user.user_id, { ...user, user_role: newRole });
        setUsers(users.map(u => u.user_id === user.user_id ? { ...u, user_role: newRole } : u));
        alert(`User role successfully changed to ${newRole}.`);
      } catch (err) {
        console.error("Failed to update user role:", err);
        alert("Failed to change user role.");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await apiService.users.deleteUser(userId);
        setUsers(users.filter(user => user.user_id !== userId));
        alert("User successfully deleted.");
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.user_role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.user_role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.user_status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.user_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2">

                    {/* Button to change role */}
                    <button
                      onClick={() => handleToggleRole({user})}
                      className={`p-2 rounded-full transition-colors ${user.user_role === 'ADMIN' ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      title={user.user_role === 'ADMIN' ? 'Demote to User' : 'Promote to admin'}
                    >
                      {user.user_role === 'ADMIN' ? <UserMinus size={16} /> : <UserPlus size={16} />}
                    </button>
                    {/* Button to change status */}
                    <button
                      onClick={() => handleToggleStatus({user})}
                      className={`p-2 rounded-full transition-colors ${user.user_status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      title={user.user_status === 'ACTIVE' ? 'Block User' : 'Activate User'}
                    >
                      {user.user_status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    
                    
                    
                    {/* Button to delete user */}
                    <button
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
