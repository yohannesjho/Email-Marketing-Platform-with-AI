'use client'
import ProtectedRoute from "@/components/ProtextedRoute"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    const { state, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
      <ProtectedRoute>
        <div className="flex min-h-screen">
          {/* Sidebar for md+ screens */}
          <aside
            className={`bg-gray-900 min-h-screen text-white flex flex-col p-4 
        fixed md:static top-0 left-0 h-full w-64 transform transition-transform 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-50`}
          >
            <h2 className="text-xl font-bold mb-6">EmailAI</h2>
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
                Dashboard
              </Link>
              <Link
                href="/dashboard/contacts"
                className="hover:bg-gray-700 p-2 rounded"
              >
                Contacts
              </Link>
              <Link
                href="/dashboard/emails"
                className="hover:bg-gray-700 p-2 rounded"
              >
                Emails
              </Link>
              <Link
                href="/dashboard/templates"
                className="hover:bg-gray-700 p-2 rounded"
              >
                Templates
              </Link>
            </nav>
            <div className="mt-auto">
              <p className="mb-2 text-sm truncate">
                Logged in as {state.user?.email}
              </p>
              <Button onClick={logout} className="w-full cursor-pointer">
                Logout
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Top bar for mobile with burger */}
            <div className="md:hidden flex items-center justify-between bg-gray-100 p-4 shadow">
              <h2 className="font-bold text-lg">EmailAI</h2>
              <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>

            <main className="flex-1 bg-gray-50 p-6">{children}</main>
          </div>

          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
        </div>
      </ProtectedRoute>
    );
}

export default DashboardLayout;