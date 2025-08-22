"use client";

import { useState, useEffect } from "react";
import { z, infer as zodInfer } from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Email } from "@/types/emails";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact } from "@/types/contacts";

const emailStatus = z.enum(["DRAFT", "SCHEDULED", "SENT", "FAILED"]);
const EmailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  status: emailStatus,
  scheduledAt: z.string().optional(),
  recipients: z.array(z.string()),
  templateId: z.string().optional(),
});

export type CreateOrUpdateEmail = zodInfer<typeof EmailSchema>;

export default function EmailFormModal({
  open,
  onOpenChange,
  onSave,
  email,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (email: CreateOrUpdateEmail) => Promise<void>;
  email: Email | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrUpdateEmail>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      subject: "",
      body: "",
      status: "DRAFT",
      scheduledAt: "",
      recipients: [],
    },
  });
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (open) {
      reset(
        email
          ? {
              subject: email.subject,
              body: email.body,
              status: email.status,
              scheduledAt: email.scheduledAt ?? "",
              recipients: email.recipients?.map((r) => r.id) ?? [],
            }
          : {
              subject: "",
              body: "",
              status: "DRAFT",
              scheduledAt: "",
              recipients: [],
            }
      );
    }
  }, [email, open, reset]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const submit = (data: CreateOrUpdateEmail) => {
    console.log(data);
    const payload = {
      ...data,
      scheduledAt: data.scheduledAt
        ? new Date(data.scheduledAt).toISOString()
        : undefined,
    };

    onSave(payload);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{email ? "Edit Email" : "New Email"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input placeholder="subject" {...register("subject")} />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>
          <div>
            <Label>Body</Label>
            <Textarea placeholder="Email body" {...register("body")} />
            {errors.body && (
              <p className="text-red-500 text-sm">{errors.body.message}</p>
            )}
          </div>
          <div>
            <Label>Scheduled At</Label>
            <Input
              type="datetime-local"
              placeholder="YYYY-MM-DD HH:MM"
              {...register("scheduledAt")}
            />
            {errors.scheduledAt && <p>{errors.scheduledAt.message}</p>}
          </div>

          <div>
            <Label>Status</Label>
            <select
              {...register("status")}
              className="w-full p-2 border rounded"
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="SENT">Sent</option>
              <option value="FAILED">Failed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
          <div>
            <Label>Recipients</Label>
            <select
              multiple
              {...register("recipients")}
              className="w-full p-2 border rounded"
            >
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
            {errors.recipients && (
              <p className="text-red-500 text-sm">
                {errors.recipients.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
