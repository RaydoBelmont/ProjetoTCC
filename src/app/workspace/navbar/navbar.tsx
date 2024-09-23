import BotaoClientes from "./botões/Clientes/clientes";
import WorkspaceConfig from "./botões/workspaceConfig/workSpaceConfig";
import BotaoSetor from "./botões/Setores/botaoSetor";
import BotaoMembros from "./botões/Membros/membros";

interface Props {
  nome: string;
  idWorkspace: string | number | null;
  isAdmin: boolean | null;
  userId: number;
  setaPagina: (numeroPagina: number) => void;
}

export default function Navbar(props: Props) {
  return (
    <nav className="sticky z-10 bg-[#212938] top-0 py-2 flex items-center justify-between px-4">
      <ul className="flex space-x-4">
        <li>
          <BotaoSetor
            setaPagina={props.setaPagina}
          />
          <BotaoMembros setaPagina={props.setaPagina} />
          <BotaoClientes setaPagina={props.setaPagina} />
        </li>
      </ul>
      <div className="flex items-center gap-1">
        <a>{props.nome}</a>
        <WorkspaceConfig />
      </div>
    </nav>
  );
}
