"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { summData } = useAuth();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xs sm:text-sm md:text-base">
            Total Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-xl md:text-2xl font-bold">
            {summData.emails}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs sm:text-sm md:text-base">
            Scheduled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-xl md:text-2xl font-bold">
            {summData.scheduledEmails}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs sm:text-sm md:text-base">
            Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-xl md:text-2xl font-bold">
            {summData.contacts}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xs sm:text-sm md:text-base">
            Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-xl md:text-2xl font-bold">
            {summData.templates}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
