import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Plus, FolderPlus, Folder, FileCode, Tag } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnippetStore } from "@/lib/store";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ProjectDialog } from "../projects/project-dialog";
import { FolderDialog } from "../folders/folder-dialog";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  
  const { 
    projects, 
    folders, 
    languages, 
    allTags,
    filter,
    setFilter,
    resetFilter
  } = useSnippetStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLanguageClick = (language: string) => {
    setFilter({ ...filter, language: filter.language === language ? undefined : language });
    navigateTo("/");
  };

  const handleTagClick = (tag: string) => {
    const currentTags = filter.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setFilter({ ...filter, tags: newTags.length > 0 ? newTags : undefined });
    navigateTo("/");
  };

  const handleProjectClick = (projectId: string) => {
    setFilter({ ...filter, projectId: filter.projectId === projectId ? undefined : projectId });
    navigateTo("/");
  };

  const handleFolderClick = (folderId: string) => {
    setFilter({ ...filter, folderId: filter.folderId === folderId ? undefined : folderId });
    navigateTo("/");
  };

  const childFolders = folders.filter(f => f.parentId === selectedFolderId);
  const topLevelFolders = folders.filter(f => !f.parentId);

  const renderFolders = (foldersList: typeof folders) => {
    return foldersList.map((folder) => (
      <div key={folder.id} className="pl-2">
        <Button 
          variant={filter.folderId === folder.id ? "secondary" : "ghost"} 
          className="w-full justify-start mb-1"
          onClick={() => handleFolderClick(folder.id)}
        >
          <Folder className="h-4 w-4 mr-2" />
          <span className="truncate">{folder.name}</span>
        </Button>
        {/* Render child folders recursively */}
        {renderFolders(folders.filter(f => f.parentId === folder.id))}
      </div>
    ));
  };

  return (
    <>
      <aside className={cn(
        "w-72 border-r bg-background",
        className
      )}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <h2 className="font-semibold">Code Snippet</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-9rem)] pb-10">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Navigation</h3>
            </div>
            <div className="space-y-1">
              <Button
                variant={isActive("/") && !filter.showFavoritesOnly ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  resetFilter();
                  navigateTo("/");
                }}
              >
                <FileCode className="h-4 w-4 mr-2" />
                All Snippets
              </Button>
              <Button
                variant={filter.showFavoritesOnly ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setFilter({ showFavoritesOnly: !filter.showFavoritesOnly });
                  navigateTo("/");
                }}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Favorites
              </Button>
            </div>
          </div>
          
          <div className="px-4 py-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Projects</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setProjectDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">No projects yet</p>
              )}
              {projects.map((project) => (
                <Button
                  key={project.id}
                  variant={filter.projectId === project.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  <span className="truncate">{project.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="px-4 py-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Folders</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setSelectedFolderId(undefined);
                  setFolderDialogOpen(true);
                }}
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {folders.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">No folders yet</p>
              )}
              {renderFolders(topLevelFolders)}
            </div>
          </div>

          <div className="px-4 py-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Languages</h3>
            </div>
            <div className="space-y-1">
              {languages.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">No languages yet</p>
              )}
              <div className="flex flex-wrap gap-2 pb-2">
                {languages.map((language) => (
                  <Badge 
                    key={language}
                    variant={filter.language === language ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleLanguageClick(language)}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Tags</h3>
            </div>
            <div className="space-y-1">
              {allTags.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">No tags yet</p>
              )}
              <div className="flex flex-wrap gap-2 pb-6">
                {allTags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant={filter.tags?.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      <ProjectDialog 
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
      />

      <FolderDialog 
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        parentFolderId={selectedFolderId}
      />
    </>
  );
}