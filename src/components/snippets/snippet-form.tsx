import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnippetStore } from "@/lib/store";
import { Snippet } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { LANGUAGES } from "@/lib/constants";
import { CodeEditor } from "./code-editor";

interface SnippetFormProps {
  snippet?: Snippet;
  isEditing?: boolean;
}

export function SnippetForm({ snippet, isEditing = false }: SnippetFormProps) {
  const navigate = useNavigate();
  const { 
    addSnippet, 
    updateSnippet, 
    projects, 
    folders 
  } = useSnippetStore();

  const [title, setTitle] = useState(snippet?.title || "");
  const [description, setDescription] = useState(snippet?.description || "");
  const [code, setCode] = useState(snippet?.code || "");
  const [language, setLanguage] = useState(snippet?.language || "javascript");
  const [projectId, setProjectId] = useState(snippet?.projectId || "");
  const [folderId, setFolderId] = useState(snippet?.folderId || "");
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  const handleTagAdd = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !code.trim()) {
      alert("Title and code are required.");
      return;
    }

    const snippetData = {
      title: title.trim(),
      description: description.trim(),
      code,
      language,
      tags,
      projectId: projectId || undefined,
      folderId: folderId || undefined,
      isFavorite: snippet?.isFavorite || false,
    };

    if (isEditing && snippet) {
      updateSnippet(snippet.id, snippetData);
    } else {
      addSnippet(snippetData);
    }
    
    navigate("/");
  };

  // Extract all parent folders for selecting
  const topLevelFolders = folders.filter(f => !f.parentId);
  
  // Function to recursively build folder options with indentation
  const buildFolderOptions = (folderList: typeof folders, depth = 0): JSX.Element[] => {
    return folderList.flatMap((folder) => {
      const children = folders.filter(f => f.parentId === folder.id);
      const indent = "— ".repeat(depth);
      
      return [
        <SelectItem key={folder.id} value={folder.id}>
          {indent}{folder.name}
        </SelectItem>,
        ...buildFolderOptions(children, depth + 1)
      ];
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your snippet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project">Project (Optional)</Label>
              <Select
                value={projectId}
                onValueChange={setProjectId}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none_project">None</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="folder">Folder (Optional)</Label>
            <Select
              value={folderId}
              onValueChange={setFolderId}
            >
              <SelectTrigger id="folder">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none_folder">None</SelectItem>
                {buildFolderOptions(topLevelFolders)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagAdd();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleTagAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleTagRemove(tag)} 
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="code">Code</Label>
            <Card className="mt-1">
              <CardContent className="p-0">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Create"} Snippet
          </Button>
        </div>
      </div>
    </form>
  );
}