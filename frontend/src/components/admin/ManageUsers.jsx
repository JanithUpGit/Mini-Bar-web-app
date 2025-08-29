// src/components/admin/ManageUsers.jsx

import React from 'react';

const ManageUsers = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Users</h2>
      <p className="text-gray-600">
        සියලුම ලියාපදිංචි පරිශීලකයින් මෙහි කළමනාකරණය කරන්න.
      </p>
      {/* මෙහිදී ඔබට users ලැයිස්තුවක්, search bar එකක්, සහ action buttons එකතු කළ හැක */}
    </div>
  );
};

export default ManageUsers;