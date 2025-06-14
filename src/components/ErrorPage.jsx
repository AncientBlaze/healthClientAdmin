import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-gray-800 p-6">
      <FaHeartbeat className="text-red-500 text-6xl mb-4 animate-pulse" />
      <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong.</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
        We're sorry, but we couldn't find the page you're looking for. If this is a
        medical emergency, please contact our support team immediately.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md shadow"
        >
          Go Home
        </button>
        {/* <a
          href="mailto:support@healthcare.com"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-md border"
        >
          Contact Support
        </a> */}
      </div>
    </div>
  );
}

export default ErrorPage;
