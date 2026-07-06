// Shared types for the repo analysis feature.

export interface RepoMeta {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  defaultBranch: string;
  url: string;
  topics: string[];
  license: string | null;
}

export interface TechItem {
  name: string;
  reason: string;
  emoji: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  emoji: string;
}

export interface FolderExplanation {
  path: string;
  purpose: string;
  emoji: string;
  fileCount: number;
  sampleFiles: string[];
  order: number;
}

export interface FileExplanation {
  path: string;
  language: string;
  summary: string;
  points: string[];
  role: string;
}

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: TreeNode[];
}

export interface AnalysisResult {
  repo: RepoMeta;
  summary: string;
  projectType: string;
  techStack: TechItem[];
  workflow: WorkflowStep[];
  folders: FolderExplanation[];
  files: FileExplanation[];
  tree: TreeNode;
  stats: {
    totalFiles: number;
    totalFolders: number;
    languages: { name: string; count: number }[];
  };
}
