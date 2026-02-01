import { Menu, Home, ClipboardList, CheckCircle, User, Briefcase, IndianRupee } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = ({ role, setSidebarOpen, collapsed, setCollapsed }) => {
    const { user } = useContext(AppContext);

    const userMenu = [
        { name: "Dashboard", path: "/user/dashboard", icon: Home },
        { name: "My Requests", path: "/user/requests", icon: ClipboardList },
        { name: "Completed", path: "/user/completed", icon: CheckCircle },
        { name: "Profile", path: "/user/profile", icon: User },
    ];

    const providerMenu = [
        { name: "Dashboard", path: "/provider/dashboard", icon: Home },
        { name: "Available Jobs", path: "/provider/jobs", icon: Briefcase },
        { name: "My Jobs", path: "/provider/my-jobs", icon: ClipboardList },
        { name: "Earnings", path: "/provider/earnings", icon: IndianRupee },
        { name: "Profile", path: "/provider/profile", icon: User },
    ];

    const menu = role === "USER" ? userMenu : providerMenu;

    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
                {/* Mobile menu toggle */}
                <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu size={22} />
                </button>

                <h1 className="font-semibold text-lg">Dashboard</h1>
            </div>

            {/* Desktop Navigation - hidden on mobile/tablet */}
            <nav className="hidden lg:flex items-center gap-1">
                {menu.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-md transition text-sm font-medium ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="text-sm text-gray-600">{user.name}</div>
        </header>
    );
};

export default Navbar;
