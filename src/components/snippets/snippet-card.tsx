import { Snippet } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash2, Star, Clock, FileCode } from "lucide-react";
import { useSnippetStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const { deleteSnippet, toggleFavorite, projects } = useSnippetStore();
  const navigate = useNavigate();
  
  const project = snippet.projectId 
    ? projects.find(p => p.id === snippet.projectId) 
    : undefined;

  const handleEdit = () => {
    navigate(`/edit/${snippet.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      deleteSnippet(snippet.id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate pr-6">{snippet.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", snippet.isFavorite ? "text-yellow-500" : "")}
            onClick={() => toggleFavorite(snippet.id)}
          >
            <Star className={cn("h-5 w-5", snippet.isFavorite ? "fill-yellow-500" : "")} />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          {format(new Date(snippet.updatedAt), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {snippet.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{snippet.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">
            <FileCode className="h-3 w-3 mr-1" />
            {snippet.language}
          </Badge>
          {project && (
            <Badge variant="outline">
              {project.name}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="bg-muted rounded-md p-3 overflow-hidden text-sm">
          <pre className="whitespace-pre-wrap line-clamp-3 font-mono text-xs">
            {snippet.code}
          </pre>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}