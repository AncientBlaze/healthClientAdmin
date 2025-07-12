import { BrowserRouter as Router, Routes, Route } from "react-router";
import ReactDOM from "react-dom/client";
import "./index.css";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import InvoiceGenerator from "./components/InvoiceGenerator.jsx";
import DoctorList from "./components/DoctorList.jsx";
import DoctorPage from "./components/DoctorPage.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import LoginCustomer from "./components/LoginCustomer.jsx";
import UpdateProfile from "./components/UpdateProfile.jsx";
import ProfileCustomer from "./components/ProfileCustomer.jsx";
import CustomerSignUp from "./components/CustomerSignUp.jsx";
import Plans from "./components/Plans.jsx";
import TestList from "./components/TestList.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Logs from "./components/Logs.jsx";
import ScanRFID from "./components/ScanRFID.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/loginCustomer" element={<LoginCustomer/>} />
      <Route path="/CustomerSignUp" element={<CustomerSignUp/>} />
      <Route path="/pro/:id" element={<ProfileCustomer/>} />
      <Route path="/forgotPassword" element={<ForgotPassword/>} />
      <Route path="/updateProfile/:id" element={<UpdateProfile/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/invoice-generator" element={<InvoiceGenerator/>} />
      <Route path="/doctor" element={<DoctorList/>} />
      <Route path="/doctors" element={<DoctorPage/>} />
      <Route path="/Tests" element={<TestList/>} />
      <Route path="*" element={<ErrorPage/>} />
      <Route path="/plans" element={<Plans/>} />
      <Route path="/logs" element={<Logs/>} />
      <Route path="/Scanner" element={<ScanRFID/>} />
    </Routes>
  </Router>
);
