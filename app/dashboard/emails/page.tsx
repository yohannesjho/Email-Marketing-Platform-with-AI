"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import EmailFormModal, { CreateOrUpdateEmail } from "@/components/emails/EmailFormModal";
import { Email } from "@/types/emails";



export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Load emails
  useEffect(() => {
    fetch("/api/email")
      .then((res) => res.json())
      .then((data) => setEmails(data));
  }, []);

  const handleSave = async (email: CreateOrUpdateEmail) => {
    
    if (selectedEmail) {
      console.log(email)
      // update
      await fetch(`/api/email/${selectedEmail.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
    } else {
      // create
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
    }

    // Refresh list
    const updated = await fetch("/api/email").then((res) => res.json());
    setEmails(updated);

    setSelectedEmail(null);
    setOpen(false);
  };

  async function deleteEmail(id: string | undefined) {
    const res = await fetch(`/api/emails/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete email");
    const updated = await fetch("/api/emails").then((res) => res.json());
    setEmails(updated);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emails</h1>
        <Button onClick={() => {
          setSelectedEmail(null);
          setOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> New Email
        </Button>
      </div>

      <div className="grid gap-4">
        {emails.map((e) => (
          <Card key={e.id} className="hover:shadow">
            <CardContent
              onClick={() => {
                setSelectedEmail(e);
                setOpen(true);
              }}
              className="p-4 cursor-pointer"
            >
              <h2 className="font-semibold">{e.subject}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{e.body}</p>
              <p className="text-xs text-gray-500 mt-2">
                Status: {e.status} | Scheduled:{" "}
                {e.scheduledAt ? new Date(e.scheduledAt).toLocaleString() : "—"}
              </p>
            </CardContent>
            <button
              onClick={() => deleteEmail(e.id)}
              className="text-red-500 hover:underline cursor-pointer px-4 py-2"
            >
              Delete
            </button>
          </Card>
        ))}
      </div>

      <EmailFormModal
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSelectedEmail(null); // clear when modal closes
        }}
        onSave={handleSave}
        email={selectedEmail}
      />
    </div>
  );
}
