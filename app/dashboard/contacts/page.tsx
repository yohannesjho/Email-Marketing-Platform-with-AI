"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import ContactFormModal from "@/components/contacts/ContactFormModal";
import DeleteContactModal from "@/components/contacts/DeleteContactModal";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";

type Contact = {
  id: string;
  name: string;
  email: string;
  tags: string[];
};

export default function ContactsPage() {
  const { state } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false)

  // Load contacts
   const fetchContacts = async () => {
     if (!state.token) return;
     setLoading(true);

     try {
       const res = await fetch(`/api/contacts?page=${page}&limit=${limit}`, {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${state.token}`,
         },
       });

       if (!res.ok) {
         console.log(res.status);
         throw new Error(`Error: ${res.status}`);
       }

       const data = await res.json();
       setTotalCount(data.totalCount);
       setContacts(data.contacts);
     } catch (err) {
       console.error("Error fetching contacts:", err);
     } finally {
       setLoading(false);
     }
   };
  useEffect(() => {

    fetchContacts();
  }, [page, limit, state.token]);


  const handleSave = async (contact: any) => {
    if (selectedContact) {
      // update
      await fetch(`/api/contacts/${selectedContact.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,  
          },
        body: JSON.stringify(contact),
      });
    } else {
      // create
      await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(contact),
      });
    }

    await fetchContacts();

    setSelectedContact(null);
    setOpen(false);
  };

  async function deleteContact(id: string) {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete contact");

    // Refresh list
   await fetchContacts();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            {contacts && contacts.length > 0 ? (
              <>
                {contacts.map((c) => (
                  <Card key={c.id} className="hover:shadow">
                    <CardContent
                      onClick={() => {
                        setSelectedContact(c);
                        setOpen(true);
                      }}
                      className="p-4 cursor-pointer"
                    >
                      <h2 className="font-semibold">{c.name}</h2>
                      <p className="text-sm text-gray-600">{c.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {c.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-200 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <button
                      onClick={() => {
                        setContactToDelete(c);
                        setDeleteOpen(true);
                      }}
                      className="text-red-500 hover:underline cursor-pointer px-4 pb-2 text-sm"
                    >
                      Delete
                    </button>
                  </Card>
                ))}
              </>
            ) : (
              <div className="flex justify-center items-center h-screen">
                <p>No Contacts Are Found</p>
              </div>
            )}
          </>
        )}
      </div>

      <ContactFormModal
        open={open}
        onOpenChange={(o)=> {
          if (!o) setSelectedContact(null);
          setOpen(o)
         
        }}
        onSave={handleSave}
        contact={selectedContact}
      />

      <DeleteContactModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        contactName={contactToDelete?.name}
        onConfirm={async () => {
          if (contactToDelete) {
            await deleteContact(contactToDelete.id);
            setContactToDelete(null);
            setDeleteOpen(false);
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
