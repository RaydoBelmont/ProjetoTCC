import BotaoTarefas from "./botoes/Tarefas/tarefas";
import BotaoClientes from "./botoes/Clientes/clientes";
import WorkspaceConfig from "./botoes/workspaceConfig/workSpaceConfig";
import BotaoQuadros from "./botoes/Quadros/quadros";


interface Props {
  nome: string;
  idWorkspace: number;
  idSetor: string | number | null; // opcional, se estamos em uma página de setor
  idUser: number | string | null;
  isAdmin: boolean | null;
}

export default function Navbar(props: Props) {
 


  return (
    <nav className="bg-[#212938] text-white top-0 left-0 w-auto h-12 flex items-center justify-between px-4">
        <ul className="flex space-x-4">
          <li>
            <BotaoTarefas />
            <BotaoClientes />
            <BotaoQuadros idSetor={props.idSetor} />
          </li>
        </ul>
      <div className="flex items-center gap-1">
        <a>{props.nome}</a>
        <WorkspaceConfig />
      </div>
    </nav>
  );
}
