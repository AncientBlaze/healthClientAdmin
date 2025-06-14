import React, { useState } from 'react';
import Sidebar from './Sidebar';
import toast, { Toaster } from 'react-hot-toast';
import axios from '../utils/axios';

function Register() {
  const handelSubmit = async (e) => {
    e.preventDefault();

    if ( AdminDetails.password !== AdminDetails.confirmPassword ) return toast.error("Password and Confirm Password doesn't match");

    const name = AdminDetails.firstName + " " + AdminDetails.lastName;
    console.log(AdminDetails);
    try {
      const res = await axios.post('/api/admin/signin', {
        name: name,
        email: AdminDetails.email,
        phone: AdminDetails.phone,
        password: AdminDetails.password
      });

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const [AdminDetails, setAdminDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  return (
    <div className='flex bg-gradient-to-br from-blue-50 to-white min-h-screen'>
      <Sidebar />

      <div className='p-10 px-20 w-full max-w-4xl mx-auto'>
        <h1 className="text-3xl font-bold text-gray-800">Admin Registration</h1>
        <p className="text-sm text-gray-600 mt-2">Secure your access with confidence</p>

        <form onSubmit={handelSubmit} className='mt-8 space-y-6'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                value={AdminDetails.firstName}
                onChange={(e) => setAdminDetails({ ...AdminDetails, firstName: e.target.value })}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                value={AdminDetails.lastName}
                onChange={(e) => setAdminDetails({ ...AdminDetails, lastName: e.target.value })}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              value={AdminDetails.email}
              onChange={(e) => setAdminDetails({ ...AdminDetails, email: e.target.value })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={AdminDetails.phone}
              onChange={(e) => setAdminDetails({ ...AdminDetails, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              value={AdminDetails.password}
              onChange={(e) => setAdminDetails({ ...AdminDetails, password: e.target.value })}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              value={AdminDetails.confirmPassword}
              onChange={(e) => setAdminDetails({ ...AdminDetails, confirmPassword: e.target.value })}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type='submit'
              className='w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200'
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  )
}

export default Register
