"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">12</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">3</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">45</p>
        </CardContent>
      </Card>
    </div>
  );
}
