import React, { useState } from "react";

export interface Membro {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

interface MembrosWorkspaceProps {
  membros: Membro[];
  onToggleAdmin: (id: number) => void;
  idWorkspace: number
  nomeWorkspace: string
}

export default function Membros(props: MembrosWorkspaceProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Membros da {props.nomeWorkspace}</h2>
      <ul className="space-y-4">
        {props.membros.map((membro) => (
          <li
            key={membro.id}
            className="flex justify-between items-center p-2 border-b border-gray-200"
          >
            <div>
              <p className="text-lg">{membro.nome}</p>
              <p className="text-gray-500">{membro.email}</p>
            </div>
            <button
              onClick={() => props.onToggleAdmin(membro.id)}
              className={`px-4 py-2 rounded ${
                membro.isAdmin
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {membro.isAdmin ? "Remover Admin" : "Tornar Admin"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

