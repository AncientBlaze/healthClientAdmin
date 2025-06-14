import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';

const InvoiceGenerator = () => {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: 'male',
    contact: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    diagnosis: ''
  });

  const [prescriptions, setPrescriptions] = useState([
  ]);

  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [taxRate, setTaxRate] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const invoiceRef = useRef();

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (id, e) => {
    const { name, value } = e.target;
    setPrescriptions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  const addPrescription = () => {
    setPrescriptions(prev => [
      ...prev,
      { id: uuidv4(), Test: '', Doctor: '', duration: '', notes: '' }
    ]);
  };

  const removePrescription = (id) => {
    setPrescriptions(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return prescriptions.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };


  const PreviewForm = () => {
    return (
      <div
        ref={invoiceRef}
        style={{
          backgroundColor: "white",
          padding: 32,
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1e40af",
                textTransform: "uppercase",
              }}
            >
              Health Insurance
            </h1>
            <p style={{ color: "#4b5563" }}>123 Health Street, Medical City</p>
            <p style={{ color: "#4b5563" }}>
              Phone: (123) 456-7890 | Email: info@medicare.com
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#1e40af" }}>
              INVOICE
            </h2>
            <p style={{ color: "#4b5563" }}>Invoice #: {invoiceNumber}</p>
            <p style={{ color: "#4b5563" }}>
              Date: {new Date(patientInfo.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              backgroundColor: "#eff6ff", // blue-50
              padding: 16,
              borderRadius: 8,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1e40af",
                marginBottom: 8,
              }}
            >
              Patient Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              <div>
                <p style={{ fontSize: 12, color: "#4b5563" }}>Name</p>
                <p style={{ fontWeight: "500" }}>{patientInfo.name}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#4b5563" }}>Age</p>
                <p style={{ fontWeight: "500" }}>{patientInfo.age}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#4b5563" }}>Gender</p>
                <p style={{ fontWeight: "500" }}>{patientInfo.gender}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#4b5563" }}>Contact</p>
                <p style={{ fontWeight: "500" }}>{patientInfo.contact}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#4b5563" }}>Doctor</p>
                <p style={{ fontWeight: "500" }}>{patientInfo.doctor}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1e40af",
              marginBottom: 8,
            }}
          >
            Diagnosis
          </h3>
          <p style={{ color: "#374151" }}>
            {patientInfo.diagnosis || "Not specified"}
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1e40af",
              marginBottom: 8,
            }}
          >
            Prescription Details
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                minWidth: "100%",
                borderCollapse: "collapse",
                borderSpacing: 0,
                border: "1px solid #e5e7eb",
              }}
            >
              <thead style={{ backgroundColor: "#f9fafb" }}>
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
                      style={{
                        padding: "12px 24px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      {item.Test}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      {item.Doctor}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      {item.duration}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      {item.notes}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      ₹{item.price || "0"}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                      {item.quantity || "0"}
                    </td>
                    <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ width: "100%", maxWidth: 400 }}>
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: "500",
                }}
              >
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: "500",
                }}
              >
                <span>Tax ({taxRate}%):</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: "500",
                }}
              >
                <span>Discount:</span>
                <span>-₹{discount}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  fontWeight: "700",
                }}
              >
                <span>Total Amount:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 32,
            borderTop: "1px solid #e5e7eb",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
        >
          <div>
            <h4
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#4b5563",
                marginBottom: 8,
                textTransform: "capitalize",
              }}
            >
              Payment Method
            </h4>
            <p style={{ textTransform: "capitalize" }}>{paymentMethod}</p>
          </div>
          <div>
            <h4
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#4b5563",
                marginBottom: 8,
              }}
            >
              Terms & Conditions
            </h4>
            <p style={{ fontSize: 10, color: "#6b7280" }}>
              1. Payment is due within 15 days
            </p>
            <p style={{ fontSize: 10, color: "#6b7280" }}>
              2. Please bring this invoice for any queries
            </p>
            <p style={{ fontSize: 10, color: "#6b7280" }}>
              3. No returns or refunds on Tests
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            color: "#6b7280",
            fontSize: 12,
          }}
        >
          <p>Thank you for choosing Health Insurance</p>
          <p style={{ color: "#9ca3af", marginTop: 8, fontSize: 10 }}>
            This is a computer generated invoice. No signature required.
          </p>
        </div>
      </div>
    );
  };


  const handlePrint = async () => {
    const element = invoiceRef.current;
    if (!element) {
      console.error('Invoice content not found.');
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Failed to generate multi-page PDF:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="container mx-auto ">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Hospital Invoice Generator</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                name="name"
                value={patientInfo.name}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={patientInfo.age}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={patientInfo.gender}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact"
                value={patientInfo.contact}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={patientInfo.date}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor</label>
              <input
                type="text"
                name="doctor"
                value={patientInfo.doctor}
                onChange={handlePatientInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <textarea
              name="diagnosis"
              value={patientInfo.diagnosis}
              onChange={handlePatientInfoChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 text-blue-700">Prescription & Billing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700"> Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (₹)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="insurance">Insurance</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="Test"
                        value={item.Test}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="Doctor"
                        value={item.Doctor}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="duration"
                        value={item.duration}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="notes"
                        value={item.notes}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="price"
                        value={item.price || ""}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity || ""}
                        onChange={(e) => handlePrescriptionChange(item.id, e)}
                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
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
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Test
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setPatientInfo({
                  name: '',
                  age: '',
                  gender: 'male',
                  contact: '',
                  address: '',
                  date: new Date().toISOString().split('T')[0],
                  doctor: '',
                  diagnosis: ''
                });
                setPrescriptions([{ id: uuidv4(), Test: '', Doctor: '', duration: '', notes: '' }]);
                setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
                setTaxRate(5);
                setDiscount(0);
              }}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
        <PreviewForm />
      </div>
    </div>
  );


};

export default InvoiceGenerator;