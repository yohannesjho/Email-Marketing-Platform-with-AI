import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "../ui/button";

type GenerateFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (p: string) => void;
  loading: boolean;
  generateError: string | null;
  generateSuccess: string | null;
};

const GenerateFormModal: React.FC<GenerateFormModalProps> = ({
  open,
  onOpenChange,
  loading,
  generateError,
  generateSuccess,
  onSave,
}) => {
  const [prompt, setPrompt] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Generate Template</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-40 my-2 p-2 border rounded"
          placeholder="Enter prompt for template generation..."
        ></textarea>
        <Button onClick={() => onSave(prompt)} className="mt-4 cursor-pointer">
          {loading ? "Generating..." : "Generate"}
        </Button>
        {generateError && <p className="text-red-500">{generateError}</p>}
        {generateSuccess && <p className="text-green-500">{generateSuccess}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateFormModal;
