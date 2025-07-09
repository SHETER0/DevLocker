import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSnippetStore } from "@/lib/store";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function ProjectDialog({ open, onOpenChange, projectId }: ProjectDialogProps) {
  const { projects, addProject, updateProject } = useSnippetStore();
  
  const existingProject = projectId 
    ? projects.find((p) => p.id === projectId) 
    : undefined;
  
  const [name, setName] = useState(existingProject?.name || "");
  const [description, setDescription] = useState(existingProject?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Project name is required.");
      return;
    }

    if (projectId && existingProject) {
      updateProject(projectId, name.trim(), description.trim() || undefined);
    } else {
      addProject(name.trim(), description.trim() || undefined);
    }
    
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{projectId ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              {projectId 
                ? "Update your project details."
                : "Create a new project to organize your snippets."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {projectId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}