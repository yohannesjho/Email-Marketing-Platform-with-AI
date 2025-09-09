"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Template } from "@/types/templates";
import TemplateFormModal, {
  CreateOrUpdateTemplate,
} from "@/components/templates/TemplateFormModal";
import DeleteTemplateModal from "@/components/templates/DeleteTemplateModal";
import GenerateFormModal from "@/components/templates/GenerateFormModal";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";

export default function TemplatesPage() {
  const { state } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [loading, setLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [updating, setUpdating] = useState(false);

  // Load templates
  const fetchTemplates = async () => {
    if (!state.token) return; // don't fetch if no token

    setLoadingTemplates(true);
    try {
      const res = await fetch(`/api/templates?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setTemplates(data.templates);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
     fetchTemplates();
  }, [page, limit]);

  const handleSave = async (template: CreateOrUpdateTemplate) => {
    if (selectedTemplate) {
      setUpdating(true);
      console.log(template);
      // update
      await fetch(`/api/templates/${selectedTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${state.token}` },
        body: JSON.stringify(template),
      })
        .catch((err) => console.log(err))
        .finally(() => {
          setUpdating(false);
        });
    } else {
      // create
      setUpdating(true)
       await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${state.token}` },
          body: JSON.stringify(template),
        })
          .catch((err) => console.log(err))
          .finally(() => {
            setUpdating(false);
          });;
    }

    // Refresh list
    await fetchTemplates();
    setSelectedTemplate(null);
    setOpen(false);
  };

  const handleGenerate = async (p: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ prompt: p }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate template");
      }

    await fetchTemplates();
      setLoading(false);
      setGenerateError(null);
      setGenerateSuccess("Template generated successfully!");
    } catch (error) {
      setLoading(false);
      setGenerateError("Error generating template");
    }
  };

  async function deleteEmail(id: string | undefined) {
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" , headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.token}`,
    }});
    if (!res.ok) throw new Error("Failed to delete email");
    setDeleteOpen(false);
    await fetchTemplates();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedTemplate(null);
              setOpen(true);
            }}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Manually
          </Button>
          <Button
            onClick={() => {
              setSelectedTemplate(null);
              setGenerateOpen(true);
            }}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Generate With AI
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {loadingTemplates ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            {templates && templates.length > 0 ? (
              <>
                {templates.map((t) => (
                  <Card key={t.id} className="hover:shadow">
                    <CardContent
                      onClick={() => {
                        setSelectedTemplate(t);
                        setOpen(true);
                      }}
                      className="p-4 cursor-pointer"
                    >
                      <h2 className="font-semibold">{t.name}</h2>
                      <h2 className="font-semibold">{t.subject}</h2>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {t.body}
                      </p>
                    </CardContent>

                    {/* Centered Delete button */}
                    <div className="flex justify-center pb-4">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedTemplate(t);
                          setDeleteOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <div className="flex justify-center items-center h-screen">
                <p>No Templates Are Found</p>
              </div>
            )}
          </>
        )}
      </div>

      <TemplateFormModal
        updating={updating}
        onUpdateChange={setUpdating}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSelectedTemplate(null); // clear when modal closes
        }}
        onSave={handleSave}
        template={selectedTemplate}
      />

      <GenerateFormModal
        prompt={prompt}
        onPromptChange={setPrompt}
        open={generateOpen}
        onOpenChange={(p) => {
          setGenerateOpen(p);
          if (!p) {
            setPrompt("");
            setGenerateError("");
            setGenerateSuccess("");
          }
        }}
        loading={loading}
        generateError={generateError}
        generateSuccess={generateSuccess}
        onSave={handleGenerate}
      />

      <DeleteTemplateModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (selectedTemplate) {
            deleteEmail(selectedTemplate.id);
          }
        }}
      />

      <Pagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />
    </div>
  );
}
