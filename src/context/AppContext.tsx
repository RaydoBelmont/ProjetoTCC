"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Workspace {
  id: number;
  nome: string;
  email: string;
}

interface AppContextType {
  workspacesContext: Workspace[];
  setWorkspacesContext: (workspaces: Workspace[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workspacesContext, setWorkspacesContext] = useState<Workspace[]>([]);

  return (
    <AppContext.Provider value={{ workspacesContext, setWorkspacesContext }}>
      {children}

    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
