import React from "react";
import { Link } from "react-router-dom";

export default function ReadyToOrder(){
    return(
        <>
         <section className="text-center py-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Order? 🚀
          </h2>
          <p className="text-gray-600 mb-6">
            Sign up today and enjoy the best bar experience online.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg--600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Login
            </Link>
          </div>
        </section>
        </>
    );
}