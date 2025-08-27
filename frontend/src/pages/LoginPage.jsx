

const LoginPage = () => {
  // ... state hooks

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">ප්‍රවේශ වන්න</h2>
        <form>
          <input
            type="email"
            placeholder="ඊමේල් ලිපිනය"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="මුරපදය"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            ප්‍රවේශ වන්න
          </button>
        </form>
        {/* ... message */}
      </div>
    </div>
  );
};

export default LoginPage;