import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaUserDoctor } from "react-icons/fa6";


const defaultImage = "https://cdn-icons-png.flaticon.com/128/8815/8815112.png";

const DoctorPage = () => {
  const API_URL = "http://localhost:2100/api/doctors";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    profilePicture: "",
    schedule: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/getAllDoctors`);
      if (data.data) setDoctors(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      if (files[0]) reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const { data } = await axios.post(`${API_URL}/register`, form);
      toast.success(data.message);
      fetchDoctors();

      // Open modal for new doctor to update schedule
      openScheduleModal(data.doctor || {});

      setForm({
        name: "",
        specialty: "",
        email: "",
        phone: "",
        profilePicture: "",
        schedule: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const toggleAvailable = async (id) => {
    try {
      const { data } = await axios.put(`${API_URL}/updateAvailable/${id}`);
      toast.success(data.message);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability");
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const { data } = await axios.delete(`${API_URL}/deleteDoctor/${id}`);
      toast.success(data.message);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const updateSchedule = async (id, schedule) => {
    try {
      const { data } = await axios.put(`${API_URL}/updateSchedule/${id}`, { schedule });
      toast.success(data.message);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update schedule");
    }
  };

  const openScheduleModal = (doctor) => {
    setCurrentDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDoctor(null);
  };

  const handleScheduleChange = (e) => {
    setCurrentDoctor(prev => ({ ...prev, schedule: e.target.value }));
  };

  const handleScheduleUpdate = () => {
    if (!currentDoctor?.schedule?.trim()) {
      toast.warning("Please enter a schedule");
      return;
    }

    updateSchedule(currentDoctor._id, currentDoctor.schedule);
    closeModal();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.name} ${doc.specialty} ${doc.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <Sidebar />
      <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-blue-700">
            Doctor Management
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Register and manage doctors in your system
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-blue-100">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Register New Doctor</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <input
                  name="specialty"
                  type="text"
                  placeholder="Cardiology"
                  value={form.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  type="text"
                  placeholder="(123) 456-7890"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {form.profilePicture && (
              <div className="flex justify-center mt-2">
                <img
                  src={form.profilePicture}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full py-3 text-white font-semibold rounded-xl shadow-lg transition duration-300 mt-4 ${isRegistering
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isRegistering ? "Registering..." : "Register Doctor"}
            </button>
          </form>
        </div>

        {/* Search and Doctor List */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-700">All Doctors</h3>

            <div className="w-full md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, specialty, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-10">
              <FaUserDoctor className="mx-auto text-gray-500 w-16 h-16 mb-4 border-2 p-2 rounded-full" />
              <h4 className="mt-4 text-lg font-medium text-gray-700">No doctors found</h4>
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Try a different search term" : "Register a new doctor to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white p-5 rounded-xl shadow border border-blue-500 hover:shadow-md transition duration-200 w-auto cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.profilePicture || defaultImage}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-sm"
                      alt="Doctor"
                    />
                    <div className="w-full">
                      <h4 className="text-lg font-semibold text-blue-800">{doc.name}</h4>
                      <p className="text-sm text-blue-600 font-medium">{doc.specialty}</p>
                      <p className="text-sm text-gray-600 mt-1">{doc.email}</p>
                      <p className="text-sm text-gray-600">{doc.phone}</p>
                      {doc.shifting && (
                        <p className="text-xs text-gray-500 mt-1">Schedule: {doc.shifting}</p>
                      )}
                    </div>

                    <div className={`w-8 h-5 rounded-full ${doc.available ? "bg-green-500" : "bg-red-500"}`}
                      title={doc.available ? "Available" : "Unavailable"} />
                  </div>

                  <div className="mt-5 flex justify-between gap-2">
                    <button
                      onClick={() => toggleAvailable(doc._id)}
                      className={`px-3 py-1.5 rounded-lg font-medium text-sm flex-1 ${doc.available
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                    >
                      {doc.available ? "Available" : "Unavailable"}
                    </button>

                    <button
                      onClick={() => openScheduleModal(doc)}
                      className="px-3 py-1.5 rounded-lg font-medium text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Schedule
                    </button>

                    <button
                      onClick={() => deleteDoctor(doc._id)}
                      className="px-3 py-1.5 rounded-lg font-medium text-sm bg-red-100 text-red-800 hover:bg-red-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          center
          classNames={{
            overlay: "bg-black/50",
            modal: "rounded-xl max-w-md w-full p-0 overflow-hidden",
          }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {currentDoctor?.name ? `Update Schedule for ${currentDoctor.name}` : "Set Schedule"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Schedule
              </label>
              <textarea
                value={currentDoctor?.schedule || ""}
                onChange={handleScheduleChange}
                placeholder="Example: Monday: 9am-5pm, Tuesday: 10am-6pm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter weekly availability in any format that works for you
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorPage;