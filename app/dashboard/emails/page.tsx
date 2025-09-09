"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import EmailFormModal, {
  CreateOrUpdateEmail,
} from "@/components/emails/EmailFormModal";
import { Email } from "@/types/emails";
import DeleteEmailModal from "@/components/emails/DeleteEmailModal";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import SendEmailModal from "@/components/emails/SendEmailModal";
import { useAuth } from "@/context/AuthContext";
 
 

export default function EmailsPage() {
  const { state } = useAuth();
  const [emails, setEmails] = useState<Email[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);

  // Load emails
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/email?page=${page}&limit=${limit}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("unable to fetch emails");
        }

        const data = await response.json();

        setEmails(data.emails);

        setTotalCount(data.totalCount);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchEmails();
  }, [page, limit]);

  const handleSave = async (email: CreateOrUpdateEmail) => {
    if (selectedEmail) {
      console.log(email);
      // update
      await fetch(`/api/email/${selectedEmail.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
         },
        body: JSON.stringify(email),
      });
    } else {
      console.log(email);
      // create
      await fetch(`/api/email`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(email),
      });
    }

    // Refresh list
   await fetchEmails();

    setSelectedEmail(null);
    setOpen(false);
  };

  async function deleteEmail(id: string | undefined) {
    const res = await fetch(`/api/email/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete email");
    await fetchEmails();
    setDeleteOpen(false);
  }

  const handleEmailSend = async (emails: string[]) => {
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          recipients: emails,
          subject: selectedEmail?.subject,
          body: selectedEmail?.body,
        }),
      });

      if (!res.ok) throw new Error("Failed to send emails");

      const data = await res.json();
      alert("Emails sent successfully!");
      console.log("Emails sent:", data);
    } catch (err) {
      console.error(err);
    }

  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emails</h1>
        <Button
          onClick={() => {
            setSelectedEmail(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New Email
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            {emails && emails.length > 0 ? (
              <>
                {emails?.map((e) => (
                  <Card key={e.id} className="hover:shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <h2 className="font-semibold">{e.subject}</h2>
                        <Button
                          onClick={() => {
                            setOpenSendModal(true);
                            setSelectedEmail(e);
                          }}
                          className="cursor-pointer"
                        >
                          Send this email
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {e.body}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Status: {e.status} | Scheduled:{" "}
                        {e.scheduledAt
                          ? new Date(e.scheduledAt).toLocaleString()
                          : "—"}
                      </p>
                    </CardContent>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => {
                          setSelectedEmail(e);
                          setOpen(true);
                        }}
                        className="text-yellow-500 cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedEmail(e);
                          setDeleteOpen(true);
                        }}
                        className="text-red-500 cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <p className="flex justify-center items-center h-screen">
                  No Emails Found
                </p>
              </>
            )}
          </>
        )}
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

      <SendEmailModal
        open={openSendModal}
        onOpenChange={setOpenSendModal}
        onSend={handleEmailSend}
      />

      <DeleteEmailModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (selectedEmail) {
            deleteEmail(selectedEmail.id);
          }
        }}
      />

      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalCount={totalCount}
        pageSize={limit}
        onPageSizeChange={setLimit}
      />
    </div>
  );
}
