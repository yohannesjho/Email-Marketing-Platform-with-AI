'use client'
import ProtectedRoute from "@/components/ProtextedRoute"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"
import Link from "next/link";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    const { state, logout} = useAuth()

    return (
      <ProtectedRoute>
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
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
              <p className="mb-2 text-sm">Logged in as {state.user?.email}</p>
              <Button onClick={logout} className="w-full cursor-pointer">
                Logout
              </Button>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
      </ProtectedRoute>
    );
}

export default DashboardLayout;