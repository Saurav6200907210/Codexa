import { useState } from "react";
import Navbar from "./Navbar";
import { ArrowLeft, BookOpen, Database, Cpu, Globe, FolderOpen, RefreshCw, Terminal, Settings } from "lucide-react";
import { FileTree } from "./FileTree";
import { Rich } from "./Rich";
import type { AnalysisResult, TreeNode } from "../types";

interface FileInfoPageProps {
  onNavigate: (page: "landing" | "analysis" | "architecture" | "file-info") => void;
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
  data: AnalysisResult | null;
}

export default function FileInfoPage({ onNavigate, lang, setLang, data }: FileInfoPageProps) {
  return (
    <div>File Info Page Shell</div>
  );
}
