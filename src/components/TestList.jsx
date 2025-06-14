import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import axios from "../utils/axios";

function TestList() {
  const [tests, setTests] = useState(null);
  const [testDetails, setTestDetails] = useState({
    name: "",
    category: "",
    description: "",
    cost: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [editedCost, setEditedCost] = useState("");

  const fetchTests = async () => {
    try {
      const response = await axios.get("/api/tests/getAllTests");
      setTests(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/tests/create", testDetails);
      toast.success(response.data.message);
      setTestDetails({ name: "", category: "", description: "", cost: 0 });
      fetchTests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create test");
    }
  };

  const handleDeleteTest = async (id) => {
    try {
      const res = await axios.delete(`/api/tests/deleteTest/${id}`);
      toast.success(res.data.message);
      fetchTests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete test");
    }
  };

  const openEditModal = (test) => {
    setSelectedTest(test);
    setEditedCost(String(test.cost)); // fix: ensure string
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
    setEditedCost("");
  };

  const handleUpdateCost = async () => {
    if (!selectedTest) return;
    try {
      const res = await axios.put(`/api/tests/updatePrice/${selectedTest._id}`, {
        cost: Number(editedCost), // parse cost here
      });
      toast.success(res.data.message);
      closeModal();
      fetchTests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cost");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <Sidebar />

      <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-blue-700">
            Tests Management
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Register and manage Tests in your system
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-blue-100">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">
            Register New Test
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Test Name"
              value={testDetails.name}
              onChange={(e) => setTestDetails({ ...testDetails, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Category"
              value={testDetails.category}
              onChange={(e) => setTestDetails({ ...testDetails, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Cost"
              value={testDetails.cost}
              onChange={(e) => setTestDetails({ ...testDetails, cost: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Description"
              value={testDetails.description}
              onChange={(e) => setTestDetails({ ...testDetails, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Test Cards */}
        {tests !== null && tests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => (
              <div key={index} className="bg-white shadow-md rounded-xl p-5 border border-gray-200 transition hover:shadow-lg">
                <h4 className="text-lg font-semibold text-blue-800">{test.name}</h4>
                <p className="text-sm text-gray-600">Category: {test.category}</p>
                <p className="text-sm text-gray-600">Cost: ₹{test.cost}</p>
                <p className="text-sm text-gray-500 mt-2">Description: {test.description}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openEditModal(test)}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit Cost
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test._id)}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No tests available.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Edit Cost for: {selectedTest?.name}
            </h3>
            <input
              type="number"
              value={editedCost}
              onChange={(e) => setEditedCost(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCost}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default TestList;
