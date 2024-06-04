import BotaoTarefas from "./botões/Tarefas/tarefas";
import BotaoClientes from "./botões/Clientes/clientes";
import WorkspaceConfig from "./botões/workspaceConfig/workSpaceConfig";
import BotaoQuadros from "./botões/Quadros/quadros";
import { useState } from "react";
interface Props {
  nome: string;
  idWorkspace: string
}

export default function Navbar(props: Props) {

  return (
    <nav className=" bg-[#212938] text-white top-0 left-0 w-auto h-12 flex items-center justify-between px-4">
      <ul className="flex space-x-4">
        <li>
          <BotaoTarefas />
          <BotaoClientes />
          <BotaoQuadros idWorkspace={props.idWorkspace}/>

        </li>
      </ul>
      <div className="flex items-center gap-1">
        <a>{props.nome}</a>
        <WorkspaceConfig />
      </div>
    </nav>
  );
}
