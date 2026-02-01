import {NavLink} from "react-router-dom";
import {
    Home,
    ClipboardList,
    CheckCircle,
    User,
    Briefcase,
    IndianRupee,
    Menu,
    X,
} from "lucide-react";

const Sidebar = ({
                     role,
                     sidebarOpen,
                     setSidebarOpen,
                     collapsed,
                     setCollapsed,
                 }) => {
    const userMenu = [
        {name: "Dashboard", path: "/user/dashboard", icon: Home},
        {name: "My Requests", path: "/user/requests", icon: ClipboardList},
        {name: "Completed", path: "/user/completed", icon: CheckCircle},
        {name: "Profile", path: "/user/profile", icon: User},
    ];

    const providerMenu = [
        {name: "Dashboard", path: "/provider/dashboard", icon: Home},
        {name: "Available Jobs", path: "/provider/jobs", icon: Briefcase},
        {name: "My Jobs", path: "/provider/my-jobs", icon: ClipboardList},
        {name: "Earnings", path: "/provider/earnings", icon: IndianRupee},
        {name: "Profile", path: "/provider/profile", icon: User},
    ];

    const menu = role === "USER" ? userMenu : providerMenu;

    return (
        <aside
            className={`
        fixed lg:static z-40 h-full bg-white shadow-md
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b">
                {!collapsed && <span className="font-bold text-lg">Serviz</span>}

                {/* Mobile close */}
                <button
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X size={22}/>
                </button>
            </div>

            <nav className="p-3 space-y-1">
                {menu.map(({name, path, icon: Icon}) => (
                    <NavLink
                        key={path}
                        to={path}
                        onClick={() => setSidebarOpen(false)}
                        className={({isActive}) =>
                            `group relative flex items-center gap-3 px-3 py-2 rounded-md transition
        ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"}`
                        }
                    >
                        {/* Icon */}
                        <Icon size={20}/>

                        {/* Text (only when expanded) */}
                        {!collapsed && (
                            <span className="text-sm font-medium">{name}</span>
                        )}

                        {/* Tooltip (only when collapsed) */}
                        {collapsed && (
                            <span
                                className="
            absolute left-full ml-3 px-3 py-1
            text-sm text-white bg-gray-900
            rounded-md whitespace-nowrap
            opacity-0 group-hover:opacity-100
            translate-x-2 group-hover:translate-x-0
            transition-all duration-200
            pointer-events-none
            z-50
          "
                            >
          {name}
        </span>
                        )}
                    </NavLink>
                ))}
            </nav>

        </aside>
    );
};

export default Sidebar;
