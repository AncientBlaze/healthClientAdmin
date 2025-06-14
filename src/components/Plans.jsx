import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "../utils/axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import toast, { Toaster } from "react-hot-toast";
import { IoSearch } from "react-icons/io5";

function Plans() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get("/api/users/getAllUsers");
        setCustomers(data.data);
        setFilteredCustomers(data.data);
      } catch (error) {
        toast.error("Failed to fetch customers.");
      }
    };
    fetchPlans();
  }, []);

  const onOpenModal = (customer) => {
    setSelectedCustomer(customer);
    setAmount("");
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
    setSelectedCustomer({});
    setAmount("");
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount) {
      return toast.error("Amount and Transaction ID are required.");
    }

    try {
      await Promise.all([
        axios.put(`/api/users/updateUserVoucher/${selectedCustomer._id}`, {
          userId: selectedCustomer._id,
          plan,
          amount,
        }),
        axios.post("/api/transaction/create", {
          user: selectedCustomer._id,
          amount,
          type: "add",
        }),
      ]);
      toast.success("Amount added successfully.");
      onCloseModal();
    } catch (error) {
      toast.error("Failed to add amount.");
    }
  };

  const deductAmount = async () => {
    if (!amount) {
      return toast.error("Amount and Transaction ID are required.");
    }

    try {
      await Promise.all([
        axios.post(`/api/users/userSpentVoucher/${selectedCustomer._id}`, {
          amount,
        }),
        axios.post("/api/transaction/create", {
          user: selectedCustomer._id,
          amount,
          type: "deduct",
        }),
      ]);
      toast.success("Amount deducted successfully.");
      onCloseModal();
    } catch (error) {
      toast.error("Failed to deduct amount.");
    }
  };

  const updatePlan = async () => {
    try {
      const updatedPlan = selectedCustomer.plan === "family" ? "basic" : "family";
      const { data } = await axios.put(`/api/users/updatePlan/${selectedCustomer._id}`, {
        plan: updatedPlan,
      });
      toast.success(data.message);
      onCloseModal();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update plan.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
              <IoSearch className="text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search for customers..."
                onChange={handleSearch}
                className="ml-2 w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">Customers</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={customer?.profilePicture}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                  <h2 className="text-lg font-semibold">{customer?.name}</h2>
                  <p className="text-gray-600 text-sm">Phone: {customer?.phone}</p>
                  <p className="text-gray-600 text-sm">Gender: {customer?.gender}</p>
                  <p className="text-gray-600 text-sm">
                    DOB: {customer?.dateOfBirth}
                  </p>
                  <p className="text-blue-600 font-medium mt-1">
                    Plan: {customer?.plan}
                  </p>
                  <button
                    onClick={() => onOpenModal(customer)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          <Modal open={open} onClose={onCloseModal} center>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg w-full max-w-md p-5"
            >
              <h2 className="text-xl font-bold mb-1">{selectedCustomer?.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{selectedCustomer?.phone}</p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="block text-sm text-gray-600">Current Plan</label>
                  <p className="font-medium text-gray-800">
                    {selectedCustomer?.plan}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={updatePlan}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Toggle Plan
                </button>
              </div>

              <label className="block text-sm text-gray-600 mb-1" htmlFor="amount">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex justify-between gap-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full"
                >
                  Add Amount
                </button>
                <button
                  type="button"
                  onClick={deductAmount}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
                >
                  Deduct Amount
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Plans;
