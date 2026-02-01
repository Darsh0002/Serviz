import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const DashboardLayout = () => {
    const { user } = useContext(AppContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - only visible on mobile/tablet */}
            <div className="lg:hidden">
                <Sidebar
                    role={user.role}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
            </div>

            <div className="flex-1 flex flex-col">
                <Navbar
                    role={user.role}
                    setSidebarOpen={setSidebarOpen}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
