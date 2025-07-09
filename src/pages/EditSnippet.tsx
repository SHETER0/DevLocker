import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { useSnippetStore } from "@/lib/store";
import { Snippet } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function EditSnippetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { snippets } = useSnippetStore();
  const [snippet, setSnippet] = useState<Snippet | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundSnippet = snippets.find((s) => s.id === id);
      if (foundSnippet) {
        setSnippet(foundSnippet);
      } else {
        // Snippet not found, redirect to home
        navigate("/", { replace: true });
      }
    }
    setLoading(false);
  }, [id, snippets, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-8">Edit Snippet</h1>
        {snippet && <SnippetForm snippet={snippet} isEditing />}
      </div>
    </MainLayout>
  );
}