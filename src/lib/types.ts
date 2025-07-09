export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  projectId?: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'reverse-alphabetical';

export interface SnippetsFilter {
  searchQuery?: string;
  language?: string;
  projectId?: string;
  folderId?: string;
  tags?: string[];
  showFavoritesOnly?: boolean;
}