import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Snippet, Project, Folder, SnippetsFilter, SortOption } from './types';

interface SnippetState {
  snippets: Snippet[];
  projects: Project[];
  folders: Folder[];
  filter: SnippetsFilter;
  sortOption: SortOption;
  languages: string[];
  allTags: string[];

  // Snippet actions
  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Project actions
  addProject: (name: string, description?: string) => void;
  updateProject: (id: string, name: string, description?: string) => void;
  deleteProject: (id: string) => void;

  // Folder actions
  addFolder: (name: string, parentId?: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;

  // Filter actions
  setFilter: (filter: SnippetsFilter) => void;
  setSortOption: (option: SortOption) => void;
  resetFilter: () => void;
}

export const useSnippetStore = create<SnippetState>()(
  persist(
    (set, get) => ({
      snippets: [],
      projects: [],
      folders: [],
      filter: {},
      sortOption: 'newest',
      languages: [],
      allTags: [],

      // Snippet actions
      addSnippet: (snippetData) => {
        const now = new Date().toISOString();
        const newSnippet: Snippet = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          isFavorite: false,
          ...snippetData,
          // Convert placeholder values to undefined
          projectId: snippetData.projectId === "none_project" ? undefined : snippetData.projectId,
          folderId: snippetData.folderId === "none_folder" ? undefined : snippetData.folderId,
        };

        set((state) => {
          // Update languages list
          const updatedLanguages = state.languages.includes(newSnippet.language)
            ? state.languages
            : [...state.languages, newSnippet.language];

          // Update tags list
          const updatedTags = [...state.allTags];
          newSnippet.tags.forEach((tag) => {
            if (!updatedTags.includes(tag)) {
              updatedTags.push(tag);
            }
          });

          return {
            snippets: [newSnippet, ...state.snippets],
            languages: updatedLanguages,
            allTags: updatedTags,
          };
        });
      },

      updateSnippet: (id, updatedFields) => {
        set((state) => {
          const processedFields = {
            ...updatedFields,
            // Convert placeholder values to undefined
            projectId: updatedFields.projectId === "none_project" ? undefined : updatedFields.projectId,
            folderId: updatedFields.folderId === "none_folder" ? undefined : updatedFields.folderId,
          };

          const updatedSnippets = state.snippets.map((snippet) => {
            if (snippet.id === id) {
              const updated = {
                ...snippet,
                ...processedFields,
                updatedAt: new Date().toISOString(),
              };
              return updated;
            }
            return snippet;
          });

          // Recalculate languages
          const languages = Array.from(new Set(updatedSnippets.map((s) => s.language)));

          // Recalculate all tags
          const allTags = Array.from(
            new Set(updatedSnippets.flatMap((s) => s.tags))
          );

          return { snippets: updatedSnippets, languages, allTags };
        });
      },

      deleteSnippet: (id) => {
        set((state) => {
          const filteredSnippets = state.snippets.filter((s) => s.id !== id);
          
          // Recalculate languages
          const languages = Array.from(new Set(filteredSnippets.map((s) => s.language)));

          // Recalculate all tags
          const allTags = Array.from(
            new Set(filteredSnippets.flatMap((s) => s.tags))
          );

          return { snippets: filteredSnippets, languages, allTags };
        });
      },

      toggleFavorite: (id) => {
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id
              ? { ...snippet, isFavorite: !snippet.isFavorite, updatedAt: new Date().toISOString() }
              : snippet
          ),
        }));
      },

      // Project actions
      addProject: (name, description) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          description,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, name, description) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, name, description } : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          // Remove project reference from snippets
          snippets: state.snippets.map((snippet) =>
            snippet.projectId === id ? { ...snippet, projectId: undefined } : snippet
          ),
        }));
      },

      // Folder actions
      addFolder: (name, parentId) => {
        // If parentId is our root placeholder value, set it to undefined
        const processedParentId = parentId === "root_folder" ? undefined : parentId;

        const newFolder: Folder = {
          id: crypto.randomUUID(),
          name,
          parentId: processedParentId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },

      updateFolder: (id, name) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        }));
      },

      deleteFolder: (id) => {
        // Also delete all child folders
        const getAllChildFolderIds = (folderId: string, allFolders: Folder[]): string[] => {
          const directChildren = allFolders.filter((f) => f.parentId === folderId);
          return [
            folderId,
            ...directChildren.flatMap((child) => getAllChildFolderIds(child.id, allFolders)),
          ];
        };

        set((state) => {
          const folderIdsToDelete = getAllChildFolderIds(id, state.folders);
          
          return {
            folders: state.folders.filter((folder) => !folderIdsToDelete.includes(folder.id)),
            // Remove folder reference from snippets
            snippets: state.snippets.map((snippet) =>
              folderIdsToDelete.includes(snippet.folderId || '')
                ? { ...snippet, folderId: undefined }
                : snippet
            ),
          };
        });
      },

      // Filter actions
      setFilter: (filter) => set({ filter }),
      setSortOption: (sortOption) => set({ sortOption }),
      resetFilter: () => set({ filter: {} }),
    }),
    {
      name: 'code-snippet-storage',
    }
  )
);

// Helper function to get filtered snippets
export const getFilteredSnippets = (state: SnippetState) => {
  let filtered = [...state.snippets];
  const { filter, sortOption } = state;

  // Apply filters
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query)
    );
  }

  if (filter.language) {
    filtered = filtered.filter((s) => s.language === filter.language);
  }

  if (filter.projectId) {
    filtered = filtered.filter((s) => s.projectId === filter.projectId);
  }

  if (filter.folderId) {
    filtered = filtered.filter((s) => s.folderId === filter.folderId);
  }

  if (filter.tags?.length) {
    filtered = filtered.filter((s) =>
      filter.tags!.some((tag) => s.tags.includes(tag))
    );
  }

  if (filter.showFavoritesOnly) {
    filtered = filtered.filter((s) => s.isFavorite);
  }

  // Apply sorting
  switch (sortOption) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      break;
    case 'alphabetical':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'reverse-alphabetical':
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
};