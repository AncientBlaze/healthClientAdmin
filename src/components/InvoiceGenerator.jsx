import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./Sidebar";
import api from "../utils/axios";

const InvoiceGenerator = () => {
  const [tests, setTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchUserId, setSearchUserId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [user, setUser] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "male",
    contact: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
    doctor: "",
    diagnosis: "",
  });

  // Prescription and billing state
  const [prescriptions, setPrescriptions] = useState([
    {
      id: uuidv4(),
      testId: "",
      Test: "",
      Doctor: "",
      duration: "",
      notes: "",
      price: "",
      quantity: 1,
    },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [taxRate, setTaxRate] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors
        const doctorsRes = await api.get("/api/doctors/getAllDoctors");
        setDoctors(doctorsRes.data.data);

        // Fetch tests
        const testsRes = await api.get("/api/tests/getAllTests");
        setTests(testsRes.data.data);

        setLoadingTests(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingTests(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectUser = (user) => {
    setUser(user);
    setSelectedUserId(user._id);
    setSearchResults([]);

    setPatientInfo({
      ...patientInfo,
      name: user.name || "",
      age: user.age || "",
      gender: user.gender || "male",
      contact: user.phone || "",
    });
  };

  const isId = (value) => /^[0-9a-fA-F]{24}$/.test(value); // Simple MongoDB ObjectID check

const searchUser = async (e) => {
  e.preventDefault();
  if (!searchUserId.trim()) return;

  setSearchLoading(true);
  setSearchError(null);
  setSearchResults([]);
  setUser(null);

  try {
    if (isId(searchUserId)) {
      const response = await api.post(`/api/users/getUserByID/${searchUserId}`);
      const data = response.data.user;
      if (data) {
        handleSelectUser(data);
      } else {
        setSearchError("No user found with this ID");
      }
    } else {
      const response = await api.get(`/api/users/searchByName/${searchUserId}`);
      const data = response.data.users;
      if (data.length === 1) {
        handleSelectUser(data[0]);
      } else if (data.length > 1) {
        setSearchResults(data);
      } else {
        setSearchError("No users found with that name");
      }
    }
  } catch (err) {
    setSearchError(err.message || "Error fetching user");
  } finally {
    setSearchLoading(false);
  }
};


  // Form handlers
  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (id, e) => {
    const { name, value } = e.target;
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
    );
  };

  const handleTestChange = (id, testId) => {
    const selectedTest = tests.find((test) => test._id === testId);

    if (selectedTest) {
      setPrescriptions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                testId: testId,
                Test: selectedTest.name,
                price: selectedTest.price,
                Doctor: selectedTest.doctor || "",
              }
            : item
        )
      );
    }
  };

  const handleDoctorChange = (id, value) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, Doctor: value } : item))
    );
  };

  const addPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        testId: "",
        Test: "",
        Doctor: "",
        duration: "",
        notes: "",
        price: "",
        quantity: 1,
      },
    ]);
  };

  const removePrescription = (id) => {
    setPrescriptions((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculation functions
  const calculateSubtotal = () => {
    return prescriptions.reduce((sum, item) => {
      return (
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
      );
    }, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateTotal = () => {
    const total = calculateSubtotal() + calculateTax() - discount;
    return total.toFixed(2);
  };

  const handlePrint = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  // Preview component
  const PreviewForm = () => {
    return (
      <div
        ref={invoiceRef}
        className="bg-[#fff] p-8 border border-[#e5e7eb] rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1447e6] uppercase">
              Health Insurance
            </h1>
            <p className="text-[#4a5565]">123 Health Street, Medical City</p>
            <p className="text-[#4a5565]">
              Phone: (123) 456-7890 | Email: info@medicare.com
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-[#1447e6]">INVOICE</h2>
            <p className="text-[#4a5565]">Invoice #{invoiceNumber}</p>
            <p className="text-[#4a5565]">
              Date: {new Date(patientInfo.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-[#eff6ff] p-4 rounded-lg">
            <h3 className="text-lg font-bold text-[#1447e6] mb-2">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#4a5565]">Name</p>
                <p className="font-medium">{patientInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#4a5565]">Age</p>
                <p className="font-medium">{patientInfo.age}</p>
              </div>
              <div>
                <p className="text-sm text-[#4a5565]">Gender</p>
                <p className="font-medium">{patientInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm text-[#4a5565]">Contact</p>
                <p className="font-medium">{patientInfo.contact}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#1447e6] mb-2">Diagnosis</h3>
          <p className="text-[#4a5565]">
            {patientInfo.diagnosis || "Not specified"}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#1447e6] mb-2">
            Prescription Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#e5e7eb]">
              <thead className="bg-[#f3f4f6]">
                <tr>
                  {[
                    "#",
                    "Test",
                    "Doctor",
                    "Duration",
                    "Notes",
                    "Price",
                    "Qty",
                    "Amount",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 text-left text-xs font-bold text-[#4a5565] uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((item, index) => (
                  <tr key={item.id} className="border-b border-[#e5e7eb]">
                    <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.Test}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.Doctor}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.duration}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.notes}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      ₹{item.price || "0"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.quantity || "0"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      ₹
                      {(parseFloat(item.price) || 0) *
                        (parseInt(item.quantity) || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-md">
            <div className="bg-[#f3f4f6] p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#4a5565]">
                  Subtotal:
                </span>
                <span className="text-sm font-bold">
                  ₹{calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#4a5565]">
                  Tax ({taxRate}%):
                </span>
                <span className="text-sm font-bold">
                  ₹{calculateTax().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#4a5565]">
                  Discount:
                </span>
                <span className="text-sm font-bold">-₹{discount}</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-sm">Total Amount:</span>
                <span className="text-sm">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#e5e7eb]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#4a5565] mb-2">
                Payment Method
              </h4>
              <p className="text-sm">{paymentMethod}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#4a5565] mb-2">
                Terms & Conditions
              </h4>
              <p className="text-xs text-[#4a5565]">
                1. Payment is due within 15 days
              </p>
              <p className="text-xs text-[#4a5565]">
                2. Please bring this invoice for any queries
              </p>
              <p className="text-xs text-[#4a5565]">
                3. No returns or refunds on Tests
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#e5e7eb] text-center text-xs text-[#4a5565]">
          <p>Thank you for choosing Health Insurance</p>
          <p className="mt-2">
            This is a computer generated invoice. No signature required.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Hospital Invoice Generator
        </h1>

        {/* User Search Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-[#1447e6]">
            Find Patient
          </h2>
          <form onSubmit={searchUser} className="flex items-center">
            <input
              type="text"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              placeholder="Enter Patient Name or ID"
              disabled={searchLoading}
              className="flex-1 border border-gray-300 rounded-md py-2 px-3"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-[#1447e6] text-white py-2 px-4 rounded-md ml-2"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {searchResults.length > 1 && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Patient:
              </label>
              <select
                onChange={(e) =>
                  handleSelectUser(
                    searchResults.find((u) => u._id === e.target.value)
                  )
                }
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Select --</option>
                {searchResults.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} | Age: {user.age} | Phone: {user.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          {searchError && (
            <div className="text-red-600 mt-2">{searchError}</div>
          )}
        </div>

        {/* Patient Information Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold mb-4 text-[#1447e6]">
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                name="name"
                value={patientInfo.name}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={patientInfo.age}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={patientInfo.gender}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                name="contact"
                value={patientInfo.contact}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={patientInfo.date}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wallet Balance
              </label>
              <input
                type="text"
                readOnly
                value={user?.walletBalance}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={patientInfo.diagnosis}
              onChange={handlePatientInfoChange}
              rows="3"
              className="resize-none mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 text-[#1447e6]">
            Prescription & Billing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount (₹)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="insurance">Insurance</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#e5e7eb]">
                {prescriptions.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loadingTests ? (
                        <p>Loading tests...</p>
                      ) : (
                        <select
                          value={item.testId}
                          onChange={(e) =>
                            handleTestChange(item.id, e.target.value)
                          }
                          className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0 w-full"
                        >
                          <option value="">Select a Test</option>
                          {tests?.map((test) => (
                            <option key={test._id} value={test._id}>
                              {test.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.Doctor}
                        onChange={(e) =>
                          handleDoctorChange(item.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0 w-full"
                      >
                        <option value="">Select a Doctor</option>
                        {doctors?.map((doctor) => (
                          <option key={doctor._id} value={doctor.name}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="duration"
                        value={item.duration}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="notes"
                        value={item.notes}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="price"
                        value={item.price || ""}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity || ""}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-[#eff6ff]0 focus:border-[#eff6ff]0 w-full"
                        min="1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => removePrescription(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addPrescription}
              className="mt-2 bg-[#eff6ff]0 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#eff6ff]0 focus:ring-offset-2"
            >
              Add Test
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setPatientInfo({
                  name: "",
                  age: "",
                  gender: "male",
                  contact: "",
                  address: "",
                  date: new Date().toISOString().split("T")[0],
                  doctor: "",
                  diagnosis: "",
                });
                setPrescriptions([
                  {
                    id: uuidv4(),
                    testId: "",
                    Test: "",
                    Doctor: "",
                    duration: "",
                    notes: "",
                    price: "",
                    quantity: 1,
                  },
                ]);
                setInvoiceNumber(
                  `INV-${Math.floor(1000 + Math.random() * 9000)}`
                );
                setTaxRate(5);
                setDiscount(0);
              }}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-[#4a5565] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Generate PDF
            </button>
          </div>
        </div>

        <div className="print-container">
          <PreviewForm />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
