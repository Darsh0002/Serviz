import { Menu } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = ({ setSidebarOpen, collapsed, setCollapsed }) => {
    const { user } = useContext(AppContext);

    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
                {/* Mobile */}
                <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu size={22} />
                </button>

                {/* Desktop collapse */}
                <button
                    className="hidden md:block"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <Menu size={22} />
                </button>

                <h1 className="font-semibold text-lg">Dashboard</h1>
            </div>

            <div className="text-sm text-gray-600">{user.name}</div>
        </header>
    );
};

export default Navbar;
