import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface FileNode {
  name: string;
  path: string;
  size: number;
  is_dir: boolean;
  has_children: boolean;
  children?: FileNode[];
}

function FileExplorer() {
  const [rootNode, setRootNode] = useState<FileNode | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [loadingDirs, setLoadingDirs] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoot();
  }, []);

  const loadRoot = async () => {
    setLoading(true);
    try {
      const homeDir = "/home";
      const data = await invoke<FileNode>("read_root_dir", { path: homeDir });
      setRootNode(data);
      setExpandedDirs(new Set([homeDir]));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (path: string) => {
    const next = new Set(expandedDirs);

    if (next.has(path)) {
      next.delete(path);
      setExpandedDirs(next);
    } else {
      next.add(path);
      setExpandedDirs(next);
      await loadChildren(path);
    }
  };

  const loadChildren = async (path: string) => {
    if (loadingDirs.has(path)) return;

    setLoadingDirs((prev) => new Set([...prev, path]));

    try {
      const children = await invoke<FileNode[]>("load_folder", { path });
      setRootNode((prev) => prev ? insertChildren(prev, path, children) : prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDirs((prev) => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
    }
  };

  const insertChildren = (node: FileNode, targetPath: string, children: FileNode[]): FileNode => {
    if (node.path === targetPath) return { ...node, children };
    if (!node.children) return node;
    return {
      ...node,
      children: node.children.map((child) => insertChildren(child, targetPath, children)),
    };
  };

  const renderNode = (node: FileNode, level: number) => {
    const isExpanded = expandedDirs.has(node.path);
    const isLoading = loadingDirs.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 h-6 pr-2 cursor-pointer text-sm select-none
            ${isSelected ? "bg-[#094771] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => node.is_dir ? toggleExpand(node.path) : setSelectedFile(node.path)}
        >
          {/* Folder arrow */}
          {node.is_dir && (
            <span className={`text-xs w-3 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}>
              {isLoading ? "·" : node.has_children ? ">" : " "}
            </span>
          )}

          {/* Name */}
          <span className={`truncate ${node.is_dir ? "text-[#cccccc]" : "text-[#9d9d9d]"}`}>
            {node.name}
          </span>
        </div>

        {/* Children */}
        {node.is_dir && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] border-r border-[#3e3e42] text-sm overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#3e3e42] shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Explorer
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        {loading && (
          <p className="text-[#888] text-xs px-3 pt-4">Loading...</p>
        )}
        {!loading && rootNode && renderNode(rootNode, 0)}
      </div>

      {/* Footer */}
      {selectedFile && (
        <div className="px-3 py-1 border-t border-[#3e3e42] shrink-0">
          <p className="text-[#888] text-[11px] truncate font-mono">{selectedFile}</p>
        </div>
      )}
    </div>
  );
}

export default FileExplorer;