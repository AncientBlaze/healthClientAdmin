import React, { useEffect } from "react";
import useUserStore from "../store/userStore";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoTrendingDownSharp } from "react-icons/io5";
import { IoMdTrendingUp } from "react-icons/io";

function ProfileCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const transactions = useUserStore((state) => state.transactions);

  useEffect(() => {
    console.log(id);
    useUserStore.getState().fetchUserByID(id);
    useUserStore.getState().transactionsById(id);
  }, [id]);

  return (
    <>
      {user ? (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-6 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Card */}
            <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-4 border-green-400"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Wallet Balance</span>
                    <p className="text-lg font-semibold text-green-600">₹ {user.walletBalance}</p>
                  </div>
                </div>
              </div>
              <button
                className="p-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full shadow transition"
                onClick={() => navigate(`/updateProfile/${id}`)}
                title="Edit Profile"
              >
                <FaEdit size={18} />
              </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h3>
              {transactions && transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-600 font-medium">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Transaction ID</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t, index) => (
                        <tr
                          key={index}
                          className="bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm"
                        >
                          <td className="px-4 py-2 rounded-l-md">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">{t._id.slice(0, 10)}</td>
                          <td className="px-4 py-2">
                            {t.type === "deduct" ? (
                              <span className="text-red-500 flex items-center gap-1">
                                <IoTrendingDownSharp />
                              </span>
                            ) : (
                              <span className="text-green-500 flex items-center gap-1">
                                <IoMdTrendingUp />
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">Payment</td>
                          <td className="px-4 py-2 text-right rounded-r-md">₹ {t.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No transactions found.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-base md:text-lg text-gray-500">Loading...</p>
        </div>
      )}
    </>
  );
}

export default ProfileCustomer;
