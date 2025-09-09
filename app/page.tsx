"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">EmailAI</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="text-sm sm:text-base px-3 py-2"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="text-sm sm:text-base px-3 py-2">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center max-w-xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to EmailAI
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            Simplify your emails, contacts, and templates with AI-powered tools.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          <Link href="/dashboard">
            <Button className="w-full py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-base sm:text-lg md:text-xl">
              <Plus className="w-6 h-6 md:w-8 md:h-8" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/contacts">
            <Button className="w-full py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-base sm:text-lg md:text-xl">
              <Plus className="w-6 h-6 md:w-8 md:h-8" />
              Contacts
            </Button>
          </Link>
          <Link href="/dashboard/emails">
            <Button className="w-full py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-base sm:text-lg md:text-xl">
              <Plus className="w-6 h-6 md:w-8 md:h-8" />
              Emails
            </Button>
          </Link>
          <Link href="/dashboard/templates">
            <Button className="w-full py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-base sm:text-lg md:text-xl">
              <Plus className="w-6 h-6 md:w-8 md:h-8" />
              Templates
            </Button>
          </Link>
        </div>

        {/* Footer / Call-to-Action */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm sm:text-base md:text-lg">
            Get started by signing up or exploring the dashboard!
          </p>
        </div>
      </main>
    </div>
  );
}
