import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useSnippetStore, getFilteredSnippets } from "@/lib/store";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { Button } from "@/components/ui/button";
import { Plus, SortAsc, SortDesc, Clock, FileText } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SortOption } from "@/lib/types";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { snippets, filter, setFilter, sortOption, setSortOption } = useSnippetStore();
  const filteredSnippets = getFilteredSnippets({ snippets, filter, sortOption } as any);
  
  const [localSearch, setLocalSearch] = useState(filter.searchQuery || "");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilter({ ...filter, searchQuery: localSearch });
  };

  const sortOptions: { label: string; value: SortOption; icon: React.ReactNode }[] = [
    { 
      label: "Newest first", 
      value: "newest", 
      icon: <Clock className="mr-2 h-4 w-4" /> 
    },
    { 
      label: "Oldest first", 
      value: "oldest", 
      icon: <Clock className="mr-2 h-4 w-4" /> 
    },
    { 
      label: "A to Z", 
      value: "alphabetical", 
      icon: <SortAsc className="mr-2 h-4 w-4" /> 
    },
    { 
      label: "Z to A", 
      value: "reverse-alphabetical", 
      icon: <SortDesc className="mr-2 h-4 w-4" /> 
    },
  ];

  const activeSortOption = sortOptions.find(option => option.value === sortOption);

  return (
    <MainLayout>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {filter.showFavoritesOnly 
              ? "Favorite Snippets" 
              : filter.language 
                ? `${filter.language} Snippets` 
                : filter.projectId
                  ? "Project Snippets"
                  : filter.folderId
                    ? "Folder Snippets"
                    : filter.tags?.length
                      ? "Tagged Snippets"
                      : "All Snippets"
            }
          </h1>
          <Button onClick={() => navigate("/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Snippet
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex w-full max-w-sm items-center">
              <Input
                placeholder="Search snippets..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="mr-2"
              />
              <Button type="submit">Search</Button>
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {activeSortOption?.icon}
                {activeSortOption?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortOption(option.value)}
                  className="flex items-center"
                >
                  {option.icon}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredSnippets.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-muted-foreground mb-4">
              No snippets found
            </h2>
            <p className="text-muted-foreground mb-8">
              {snippets.length === 0 
                ? "Create your first snippet to get started"
                : "Try adjusting your filters or search query"
              }
            </p>
            <Button onClick={() => navigate("/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Snippet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}