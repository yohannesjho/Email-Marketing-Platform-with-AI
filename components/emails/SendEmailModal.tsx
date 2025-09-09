import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
 
import { Contact } from '@/types/contacts';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
 

const SendEmailModal = ({
  open,
  onOpenChange,
  onSend,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSend: (emails: string[]) => void;
}) => {
  const { state } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/contacts", { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.token}` } })
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts));
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedEmails(values);
  };

  const handleSendClick = () => {
    if (selectedEmails.length === 0) {
      alert("Please select at least one contact.");
      return;
    }
    onSend(selectedEmails);
    onOpenChange(false);  
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>
        <select
          multiple
          className="w-full p-2 border rounded mt-4"
          onChange={handleSelectionChange}
        >
          {contacts.length === 0 ? (
            <option disabled>No contacts available</option>
          ) : (
            contacts.map((contact) => (
              <option key={contact.id} value={contact.email}>
                {contact.name} ({contact.email})
              </option>
            ))
          )}
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendClick}>Send Email</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendEmailModal