import { FaHome, FaSignOutAlt, FaFileInvoice } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { RiAdminFill } from "react-icons/ri";
import { GiHypodermicTest } from "react-icons/gi";
import logo from '../assets/logo.png'

const menuItems = [
    { icon: <FaHome />, label: "Home", to: "/Dashboard" },
    { icon: <FaFileInvoice />, label: "Invoice", to: "/invoice-generator" },
    { icon: <FaUserDoctor />, label: "Doctors", to: "/doctors" },
    { icon: <FaHome />, label: "Plans", to: "/plans" },
    { icon: <GiHypodermicTest />, label: "Tests", to: "/Tests" },
    { icon: <RiAdminFill />, label: "Add User", to: "/register" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="h-auto min-w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white shadow-lg flex flex-col">
            <div className="h-20 border-b border-blue-800 flex items-center justify-center flex-col">
                <p className="text-xl font-bold tracking-wide">HealthInsurance</p>
                <div className="text-sm mt-1 inline-flex gap-3 items-center">Created by <img src={logo} className="w-28 h-8 object-cover" /></div>
            </div>
            <nav className="flex-1 py-6">
                <ul className="space-y-2">
                    {menuItems.map((item, idx) => (
                        <li key={idx}>
                            <Link
                                to={item.to}
                                onClick={() => navigate(item.to)}
                                className={`flex items-center px-6 py-3 rounded-lg ${location.pathname === item.to ? "bg-blue-800" : "hover:bg-blue-800"} transition-colors group`}
                            >
                                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex items-center justify-center border-t border-blue-800 p-6">
                <Link
                    to="/login"
                    className="flex items-center px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors group"
                >
                    <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                        <FaSignOutAlt />
                    </span>
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </aside>
    );
}

