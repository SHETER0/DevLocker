import { MainLayout } from "@/components/layout/main-layout";
import { SnippetForm } from "@/components/snippets/snippet-form";

export default function NewSnippetPage() {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-8">Create New Snippet</h1>
        <SnippetForm />
      </div>
    </MainLayout>
  );
}