'use client'
import { createContext, useContext, useState } from "react";

type dadosUsuario = {
    idUser: number | string | null,
    idWorkspace: number | string | null
    idSetor: number | string | null
    setIdUser: (id: number | string | null) => void;
    setIdWorkspace: (id: number | string | null) => void;
    setIdSetor: (id: number | string | null) => void;

  };

  const dadosUsuarioDefaultValues: dadosUsuario = {
    idUser: null,
    idWorkspace: null,
    idSetor: null,
    setIdUser: () => {},
    setIdWorkspace: () => {},
    setIdSetor: () => {},
  };
  

  const dadosUsuarioContext = createContext<dadosUsuario>(
    dadosUsuarioDefaultValues
  );

  export function useDadosUsuario() {
    return useContext(dadosUsuarioContext);
  }
  
  type Props = {
    children: React.ReactNode;
  };

  export function DadosUsuarioProvider({ children }: Props) {
    const [idUser, setIdUser] = useState<number | string | null>(null);
    const [idWorkspace, setIdWorkspace] = useState<number | string | null>(null);
    const [idSetor, setIdSetor] = useState<number | string | null>(null);

    const value = {
        idUser,
        idWorkspace,
        idSetor,
        setIdUser,
        setIdWorkspace,
        setIdSetor,
    };
  
    return (
      <>
        <dadosUsuarioContext.Provider value={value}>{children}</dadosUsuarioContext.Provider>
      </>
    );
  }
  