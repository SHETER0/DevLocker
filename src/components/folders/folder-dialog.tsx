import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSnippetStore } from "@/lib/store";

interface FolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string;
  parentFolderId?: string;
}

export function FolderDialog({ open, onOpenChange, folderId, parentFolderId }: FolderDialogProps) {
  const { folders, addFolder, updateFolder } = useSnippetStore();
  
  const existingFolder = folderId 
    ? folders.find((f) => f.id === folderId) 
    : undefined;
  
  const [name, setName] = useState(existingFolder?.name || "");
  const [selectedParentId, setSelectedParentId] = useState(
    folderId ? existingFolder?.parentId : parentFolderId
  );

  // Filter out the current folder and its children to prevent circular references
  const getAvailableParentFolders = () => {
    if (!folderId) return folders;
    
    // Function to get all descendant folder IDs
    const getDescendantIds = (currentFolderId: string): string[] => {
      const childFolders = folders.filter(f => f.parentId === currentFolderId);
      return [
        currentFolderId,
        ...childFolders.flatMap(child => getDescendantIds(child.id))
      ];
    };
    
    const unavailableFolderIds = getDescendantIds(folderId);
    return folders.filter(f => !unavailableFolderIds.includes(f.id));
  };

  const availableParentFolders = getAvailableParentFolders();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Folder name is required.");
      return;
    }

    if (folderId && existingFolder) {
      updateFolder(folderId, name.trim());
      // Note: We don't allow changing parent in edit mode to avoid complex parent-child validation
    } else {
      addFolder(name.trim(), selectedParentId);
    }
    
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setSelectedParentId(parentFolderId);
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
            <DialogTitle>{folderId ? "Edit Folder" : "Create Folder"}</DialogTitle>
            <DialogDescription>
              {folderId 
                ? "Update your folder details."
                : "Create a new folder to organize your snippets."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Folder name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            
            {!folderId && (
              <div className="grid gap-2">
                <Label htmlFor="parent">Parent Folder (Optional)</Label>
                <Select
                  value={selectedParentId}
                  onValueChange={setSelectedParentId}
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select a parent folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root_folder">None (Root folder)</SelectItem>
                    {availableParentFolders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {folderId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}