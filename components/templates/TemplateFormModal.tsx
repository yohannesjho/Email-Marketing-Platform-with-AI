"use client";

import {useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Template } from "@/types/templates";

const TemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export type CreateOrUpdateTemplate = zodInfer<typeof TemplateSchema>;

export default function TemplateFormModal({
  open,
  onOpenChange,
  onSave,
  template,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (template: CreateOrUpdateTemplate) => Promise<void>;
  template: Template | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrUpdateTemplate>({
    resolver: zodResolver(TemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      body: "",
    },
  });
  
  useEffect(() => {
    if (open) {
      reset(
        template
          ? {
              name: template.name,
              subject: template.subject,
              body: template.body,
            }
          : {
              name: "",
              subject: "",
              body: "",
            }
      );
    }
  }, [template, open, reset]);
 
  const submit = (data: CreateOrUpdateTemplate) => {
    onSave(data);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl flex flex-col">
        {/* Header */}
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {template ? "Edit Template" : "New Template"}
          </DialogTitle>
        </DialogHeader>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-1">
          <form
            id="template-form"
            onSubmit={handleSubmit(submit)}
            className="space-y-4"
          >
            <div>
              <Label>Name</Label>
              <Input placeholder="Name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>Subject</Label>
              <Input placeholder="Subject" {...register("subject")} />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <Label>Body</Label>
              <Textarea
                placeholder="Email body"
                className="min-h-[200px] max-h-[300px] resize-y"
                {...register("body")}
              />
              {errors.body && (
                <p className="text-red-500 text-sm">{errors.body.message}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" form="template-form" className="cursor-pointer">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
