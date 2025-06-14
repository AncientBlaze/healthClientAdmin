import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "./Sidebar";
import { Link } from "react-router";

const data = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 300 },
  { name: "Mar", uv: 500 },
  { name: "Apr", uv: 200 },
  { name: "May", uv: 600 },
  { name: "Jun", uv: 700 },
];

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="mx-auto bg-white/90 shadow-2xl flex flex-row h-screen">
        <Sidebar />
        <div className="flex-1 px-10 py-8">
          <h1 className="text-4xl font-extrabold mb-8 text-indigo-800 tracking-tight drop-shadow">
            Dashboard
          </h1>
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 3v18h18"></path>
                <path d="M9 17V9m4 8V5m4 12v-6"></path>
              </svg>
              Monthly Data Overview
            </h2>
            <div className="w-full h-72 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-xl shadow-inner p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#c7d2fe" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6366f1", fontWeight: 600 }}
                  />
                  <YAxis tick={{ fill: "#6366f1", fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#6366f1",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      border: "none",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#6366f1"
                    strokeWidth={4}
                    dot={{
                      r: 7,
                      fill: "#6366f1",
                      stroke: "#fff",
                      strokeWidth: 3,
                    }}
                    activeDot={{
                      r: 10,
                      fill: "#818cf8",
                      stroke: "#fff",
                      strokeWidth: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Link to="/test" className="group">
              <div className="bg-gradient-to-br from-indigo-200 via-white to-blue-100 rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center border border-indigo-100 group-hover:scale-105 duration-200">
                <div className="bg-indigo-500 text-white rounded-full p-3 mb-4 shadow-lg group-hover:bg-indigo-600 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20l9-5-9-5-9 5 9 5z"></path>
                    <path d="M12 12V4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-indigo-800 group-hover:text-indigo-900 transition">
                  Test Patients
                </h3>
                <p className="text-gray-600 text-center">
                  View all test patients and their test results
                </p>
              </div>
            </Link>
            <Link to="/doctors" className="group">
              <div className="bg-gradient-to-br from-blue-200 via-white to-indigo-100 rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center border border-blue-100 group-hover:scale-105 duration-200">
                <div className="bg-blue-500 text-white rounded-full p-3 mb-4 shadow-lg group-hover:bg-blue-600 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
                    <path d="M6.5 20c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-800 group-hover:text-blue-900 transition">
                  Doctors
                </h3>
                <p className="text-gray-600 text-center">
                  View all doctors and their schedules
                </p>
              </div>
            </Link>
            <Link to="/reports" className="group">
              <div className="bg-gradient-to-br from-purple-200 via-white to-indigo-100 rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center border border-purple-100 group-hover:scale-105 duration-200">
                <div className="bg-purple-500 text-white rounded-full p-3 mb-4 shadow-lg group-hover:bg-purple-600 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 17v-2a4 4 0 0 1 8 0v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-800 group-hover:text-purple-900 transition">
                  Reports
                </h3>
                <p className="text-gray-600 text-center">
                  Access analytics and reports
                </p>
              </div>
            </Link>
            <Link to="/appointments" className="group">
              <div className="bg-gradient-to-br from-green-200 via-white to-blue-100 rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center border border-green-100 group-hover:scale-105 duration-200">
                <div className="bg-green-500 text-white rounded-full p-3 mb-4 shadow-lg group-hover:bg-green-600 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5v14"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-800 group-hover:text-green-900 transition">
                  Appointments
                </h3>
                <p className="text-gray-600 text-center">
                  Schedule and view upcoming appointments
                </p>
              </div>
            </Link>
            <Link to="/feedback" className="group">
              <div className="bg-gradient-to-br from-yellow-200 via-white to-indigo-100 rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center border border-yellow-100 group-hover:scale-105 duration-200">
                <div className="bg-yellow-500 text-white rounded-full p-3 mb-4 shadow-lg group-hover:bg-yellow-600 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20l9-5-9-5-9 5 9 5z"></path>
                    <path d="M4 4h16v4H4z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-yellow-800 group-hover:text-yellow-900 transition">
                  Feedback
                </h3>
                <p className="text-gray-600 text-center">
                  Provide feedback and suggestions
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

