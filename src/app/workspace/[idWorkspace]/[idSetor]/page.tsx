"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import NavbarSetor from "./navbar/navbar";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
} from "../../../lib/material-tailwindcss/material-tailwindcss";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { RiInboxArchiveLine } from "react-icons/ri";
import { IoMdSearch } from "react-icons/io";
import ModalCadQuadro from "./quadros/Modals/modalCadQuadro";
import { useEffect, useState } from "react";
import { buscarQuadros } from "@/app/lib/QuadrosFunctions/libBuscarQuadros";
import { listaChamados } from "@/app/lib/ChamadosFunctions/libListarChamados";
import { buscaSetor } from "@/app/lib/SetoresFunctions/listarSetoresIdWorkspaceIdUser";
import CryptoJS from "crypto-js";
import ModalCadChamado, {
  Cliente,
  Prioridade,
} from "./quadros/Modals/modalCadChamado";
import ModalChamado from "./quadros/Modals/modalChamado";
import { useSession } from "next-auth/react";

import { getMembroParaWorkspace } from "@/app/lib/WorkspaceFunctions/Membros/buscaMembroDaWorkspace";
import { buscaIdUserPorEmail } from "@/app/lib/UserFunctions/buscaIDuser";
import Loading from "../Loading";
import { listaChamadosPorQuadro } from "../../../../../controllers/Chamados/chamadosController";
import { buscarClientes } from "@/app/lib/WorkspaceFunctions/Clientes/buscaClientesDaWorkspace";
import { listaPrioridades } from "@/app/lib/PrioridadesFunctions/libListaPrioridades";

type Membro = {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
  isCriador: boolean;
  usuarioExiste: boolean;
};

export type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
  criadoEm: Date;
  atualizadoEm: Date;
  concluidoEm: Date;
  arquivado: Boolean;
  solucao: string;
  status: string;
  prioridadeId: number;
  criadoPor: number;
  clienteId: number;
  quadroId: number;
  workspaceId: number;
  numeroSequencial: number;
  cliente: {
    id: number;
    nome: string;
  };
  prioridade: {
    nome: string;
  };
  users: {
    user: {
      id: number;
      nome: string;
    };
  }[];
  quadro: {
    nome: string;
  };
};

type Setor = {
  id: number;
  nome: string;
  workspaceId: number;
};

export type Quadro = {
  id: number;
  nome: string;
  ativo: boolean;
  responsavelId: number;
  responsavel: {
    id: number;
    nome: string;
    email: string;
  };
  chamados: Chamado[];
};

const Setor: React.FC = () => {
  // Estados gerais
  const router = useRouter();
  const { idWorkspace, idSetor } = useParams();
  const { data: session, status } = useSession();
  const [carregandoPagina, setCarregandoPagina] = useState(true);
  const [userId, setUserId] = useState<number>();

  //Setor e Workspace
  const [membroDaWorkspace, setMembroDaWorkspace] = useState<Membro>();
  const [setor, setSetor] = useState<Setor>();
  const [decryptedIdSetor, setDecryptedIdSetor] = useState<number>();
  const [decryptedIdWorkspace, setDecryptedIdWorkspace] = useState<number>();

  //Quadro
  const [isOpenCadQuadro, setIsOpenCadQuadro] = useState<boolean>(false);
  const [tipoModalCadQuadro, setTipoModalCadQuadro] = useState<string>("");
  const [quadros, setQuadros] = useState<Quadro[]>([]);
  const [idQuadroEditar, setIdQuadroEditar] = useState<number>();
  const [mostrarArquivados, setMostrarArquivados] = useState<{
    [key: number]: boolean;
  }>({});

  //Filtro quadro
  const filtroPesquisarChamado = ["Cliente", "Nº"];
  const [isOpenFiltroChamados, setIsOpenFiltroChamados] = useState<{
    [key: number]: boolean;
  }>({});
  const [opcaoSelecionadaFiltroChamados, setOpcaoSelecionadaFiltroChamados] =
    useState<{
      [key: number]: string;
    }>({});
  const [filtroTexto, setFiltroTexto] = useState<{
    [key: number]: string;
  }>({});

  //Chamado
  const [isOpenChamado, setIsOpenChamado] = useState<boolean>(false); //var pro dialog do chamado
  const [isOpenCadChamado, setIsOpenCadChamado] = useState<boolean>(false); //var para dialog do cad chamado
  const [openChamado, setOpenChamado] = useState<Chamado>(null);
  const [tipoModalCadChamado, setTipoModalCadChamado] = useState<string>("");
  const [chamadosPorQuadro, setChamadosPorQuadro] = useState<{
    [key: number]: Chamado[];
  }>({});
  const [carregandoTodosChamados, setCarregandoTodosChamados] = useState(true);
  const [idQuadroNovoChamado, setIdQuadroNovoChamado] = useState<number>();

  //States para os relatorios
  const [listaClientes, setListaClientes] = useState<Cliente[]>();
  const [listaDePrioridades, setListaDePrioridades] = useState<Prioridade[]>();

  const getClientes = async (idWorkspace: number) => {
    const listaClientes = await buscarClientes(idWorkspace);
    setListaClientes(listaClientes);
  };

  const getSetor = async (idSetor: number) => {
    try {
      const result = await buscaSetor(idSetor);
      setSetor(result);
      return setor;
    } catch (error) {
      console.log("Erro ao tentar buscar setor.", error);
    }
  };

  const getPrioridades = async (idSetor: number) => {
    try {
      const listaDePrioridades = await listaPrioridades(idSetor);
      if (listaDePrioridades) {
        setListaDePrioridades(listaDePrioridades);
      }
    } catch (error) {
      console.log(
        "Houve um erro ao tentar buscar a lista de prioridades",
        error
      );
    }
  };

  const buscarChamadosPorQuadro = async (idQuadro: number) => {
    try {
      const chamados = await listaChamados(idQuadro);
      return chamados;
    } catch (error) {
      console.log("Erro ao tentar buscar chamados para o quadro", error);
      return [];
    }
  };

  const getQuadrosEChamados = async (decryptedSetorId: number) => {
    try {
      const listaQuadros = await buscarQuadros(Number(decryptedSetorId));

      if (listaQuadros) {
        setQuadros(listaQuadros);

        const chamadosMap: { [key: number]: Chamado[] } = {};

        // Mapeando chamados para cada quadro
        await Promise.all(
          listaQuadros.map(async (quadro) => {
            const chamados = await buscarChamadosPorQuadro(quadro.id);
            chamadosMap[quadro.id] = chamados;
          })
        );
        setChamadosPorQuadro(chamadosMap);
        setCarregandoTodosChamados(false); // Finaliza o estado de carregamento geral
      }
    } catch (error) {
      console.log("Erro ao tentar buscar quadros e chamados", error);
      setCarregandoTodosChamados(false); // Finaliza o estado de carregamento mesmo em caso de erro
    }
  };

  const atualizaQuadrosChamados = async (idQuadro?: number) => {
    try {
      if (!idQuadro) {
        setCarregandoTodosChamados(true);

        // Atualiza todos os quadros se nenhum idQuadro for fornecido
        const listaQuadros = await buscarQuadros(decryptedIdSetor);
        setQuadros(listaQuadros);
        const chamadosMap: { [key: number]: Chamado[] } = {};

        await Promise.all(
          listaQuadros.map(async (quadro) => {
            const chamados = await buscarChamadosPorQuadro(quadro.id);
            chamadosMap[quadro.id] = chamados;
          })
        );

        setChamadosPorQuadro(chamadosMap);
      } else {
        // Se idQuadro for fornecido, atualiza apenas os chamados desse quadro
        const chamados = await buscarChamadosPorQuadro(idQuadro);
        setChamadosPorQuadro((prev) => ({
          ...prev,
          [idQuadro]: chamados,
        }));
      }
    } catch (error) {
      console.log("Erro ao tentar atualizar os quadros e chamados", error);
    } finally {
      setCarregandoTodosChamados(false); // Finaliza o carregamento
    }
  };

  const toggleArquivados = (quadroId: number) => {
    setMostrarArquivados((prev) => ({
      ...prev,
      [quadroId]: !prev[quadroId],
    }));
  };

  const abrirFiltroOpcoesChamados = (quadroId: number) => {
    setIsOpenFiltroChamados((prevState) => ({
      ...prevState,
      [quadroId]: !prevState[quadroId],
    }));
  };

  const selecionarOpcaoFiltroChamados = (quadroId: number, opcao: string) => {
    setOpcaoSelecionadaFiltroChamados((prevState) => ({
      ...prevState,
      [quadroId]: opcao,
    }));
    abrirFiltroOpcoesChamados(quadroId);
  };

  const setFiltroPesquisar = (quadroId: number, opcao: string) => {
    setFiltroTexto((prevState) => ({
      ...prevState,
      [quadroId]: opcao,
    }));
  };

  const filtrarChamados = (chamados: Chamado[], quadroId: number) => {
    const textoFiltrado = filtroTexto[quadroId]?.toLowerCase() || "";

    if (!textoFiltrado) return chamados;

    const opcaoFiltro = opcaoSelecionadaFiltroChamados[quadroId];

    switch (opcaoFiltro) {
      case "Cliente":
        return chamados.filter((chamado) =>
          chamado.cliente.nome.toLowerCase().includes(textoFiltrado)
        );
      case "Nº":
        return chamados.filter((chamado) =>
          chamado.numeroSequencial.toString().includes(textoFiltrado)
        );
      default:
        return chamados.filter((chamado) =>
          chamado.cliente.nome.toLowerCase().includes(textoFiltrado)
        );
    }
  };

  const acaoBotaoEditar = (idQuadro: number) => {
    setTipoModalCadQuadro("EDITAR");
    setIdQuadroEditar(idQuadro);
    setIsOpenCadQuadro(true);
  };

  const acaoBotaoNovoChamado = (idQuadro: number) => {
    setIsOpenCadChamado(true);
    setIdQuadroNovoChamado(idQuadro);
    setTipoModalCadChamado("INSERIR");
  };

  const acaoAbrirChamado = (chamado: Chamado) => {
    setOpenChamado(chamado);
    setIsOpenChamado(true);
  };

  const limparChamado = () => {
    setOpenChamado(null);
  };

  // Função para formatar a data no estilo DD/MM/AAAA - HH:MM
  const formatarData = (dataCriacao: Date) => {
    const data = new Date(dataCriacao);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${dataFormatada}`;
  };

  useEffect(() => {
    if (status === "loading") return; // Aguarda o carregamento da sessão

    const verificarMembro = async () => {
      if (session && session?.user) {
        const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

        const decryptedWorkspaceIdBytes = CryptoJS.AES.decrypt(
          decodeURIComponent(String(idWorkspace)),
          secretKey
        );

        const decryptedSetorIdBytes = CryptoJS.AES.decrypt(
          decodeURIComponent(String(idSetor)),
          secretKey
        );

        const decryptedWorkspaceId = decryptedWorkspaceIdBytes.toString(
          CryptoJS.enc.Utf8
        );
        const decryptedSetorId = decryptedSetorIdBytes.toString(
          CryptoJS.enc.Utf8
        );

        if (decryptedWorkspaceId && decryptedSetorId) {
          try {
            const idMembro = await buscaIdUserPorEmail(
              String(session.user.email)
            );
            setUserId(idMembro);

            const membro = await getMembroParaWorkspace(
              Number(idMembro),
              Number(decryptedWorkspaceId)
            );
            if (membro.usuarioExiste === false) {
              router.push("/");
            } else {
              setMembroDaWorkspace(membro);
              setDecryptedIdWorkspace(Number(decryptedWorkspaceId));
              setDecryptedIdSetor(Number(decryptedSetorId));
              await getQuadrosEChamados(Number(decryptedSetorId));
              await getSetor(Number(decryptedSetorId));
              await getClientes(Number(decryptedWorkspaceId));
              await getPrioridades(Number(decryptedSetorId));
              setCarregandoPagina(false);
            }
          } catch (error) {
            console.log(
              "Erro ao tentar buscar por membro da workspace.",
              error
            );
            setCarregandoPagina(false);
          }
        }
      }
    };

    if (!session) {
      router.push("/");
    }

    verificarMembro();
  }, [idSetor, session, status]);

  if (carregandoPagina || status === "loading") {
    return <Loading />;
  } else if (session?.user && status === "authenticated") {
    return (
      <main>
        <div className="w-full flex flex-col items-center ">
          <NavbarSetor
            idSetor={Number(idSetor)}
            idWorkspace={Number(idWorkspace)}
            isOpen={isOpenCadQuadro}
            setModalOpen={() => setIsOpenCadQuadro(!isOpenCadQuadro)}
            setTipoModal={() => setTipoModalCadQuadro("INSERIR")}
            tipoModal={tipoModalCadQuadro}
            listaChamadosPorQuadro={chamadosPorQuadro}
            listaQuadros={quadros}
            clientes={listaClientes}
            listaPrioridades={listaDePrioridades}
            acaoAbrirChamado={acaoAbrirChamado}
          />
          <Typography variant="h3" className="pb-8">
            {setor ? "Quadros do " + setor.nome : ""}
          </Typography>
          <div className="flex flex-col w-full p-2 gap-y-4 justify-center items-start">
            <div className="flex flex-wrap p-4 gap-4 gap-y-8 items-start">
              {quadros.length > 0 ? (
                quadros.map((quadro) => (
                  <Card
                    key={quadro.id}
                    className="w-[350px] h-[440px] bg-[#202938]"
                  >
                    <CardHeader className="bg-[#07b6d5] relative flex justify-between items-center">
                      <Button variant="text" className="ml-2 p-1 rounded-lg ">
                        <FaTrashAlt className="h-4 w-4 text-red-900" />
                      </Button>
                      <h3
                        className="text-black text-lg px-2 py-1.5 text-center font-bold truncate"
                        title={quadro.nome}
                      >
                        {quadro.nome}
                      </h3>

                      <Button
                        variant="text"
                        onClick={() => acaoBotaoEditar(quadro.id)}
                        className="mr-2 p-1 rounded-lg"
                      >
                        <FaEdit className="h-5 w-5 text-black" />
                      </Button>
                    </CardHeader>
                    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                      <div className="flex justify-between items-center mt-1">
                        <span
                          className="text-gray-500 p-1 text-sm text-center truncate pr-2 pl-4"
                          title={quadro.responsavel.nome}
                        >
                          Responsável: {quadro.responsavel.nome}
                        </span>
                        <button
                          title="Arquivados"
                          onClick={() => toggleArquivados(quadro.id)}
                          className={`${
                            mostrarArquivados[quadro.id]
                              ? "bg-gray-700 text-white"
                              : ""
                          } rounded hover:bg-gray-700 hover:text-white p-1 mr-1`}
                        >
                          <RiInboxArchiveLine />
                        </button>
                      </div>

                      {/* filtro pesquisar chamado */}
                      <div className="flex items-center justify-start pl-3 pt-1 gap-1">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div
                              className="flex items-center bg-transparent rounded-full border border-gray-600 px-2 py-1 h-8 cursor-pointer text-sm w-20"
                              onClick={() =>
                                abrirFiltroOpcoesChamados(quadro.id)
                              }
                            >
                              <span className="flex-1 text-gray-500">
                                {opcaoSelecionadaFiltroChamados[quadro.id]
                                  ? opcaoSelecionadaFiltroChamados[quadro.id]
                                  : "Filtro"}
                              </span>
                              <IoMdSearch className="text-gray-500" />
                            </div>
                            {isOpenFiltroChamados[quadro.id] && (
                              <div className="absolute left-0 mt-1 bg-[#394152] rounded-md shadow-lg z-10 w-40 max-h-40 overflow-y-auto custom-scrollbar">
                                {filtroPesquisarChamado.map((option) => (
                                  <div
                                    key={option}
                                    onClick={() =>
                                      selecionarOpcaoFiltroChamados(
                                        quadro.id,
                                        option
                                      )
                                    }
                                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-600 hover:text-white cursor-pointer"
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <input
                            className="bg-transparent rounded-full border border-gray-600 text-sm px-2 py-1 h-8 text-gray-500"
                            placeholder="Buscar..."
                            value={filtroTexto[quadro.id] ?? ""} // Use fallback if undefined
                            onChange={(e) =>
                              setFiltroPesquisar(quadro.id, e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <CardBody className="flex flex-col space-y-2 pb-4 pt-4">
                        {carregandoTodosChamados ? (
                          <Typography variant="small" className="text-gray-500">
                            Carregando chamados...
                          </Typography>
                        ) : mostrarArquivados[quadro.id] ? (
                          // Mostrar chamados arquivados
                          filtrarChamados(
                            chamadosPorQuadro[quadro.id]?.filter(
                              (chamado) => chamado.arquivado
                            ),
                            quadro.id
                          )?.length > 0 ? (
                            filtrarChamados(
                              chamadosPorQuadro[quadro.id]?.filter(
                                (chamado) => chamado.arquivado
                              ),
                              quadro.id
                            ).map((chamado) => (
                              <div
                                key={chamado.numeroSequencial}
                                className="pt-1"
                              >
                                <div className="flex justify-between">
                                  <div className="flex gap-2">
                                    <Chip
                                      value={formatarData(chamado.criadoEm)}
                                      className="text-[11px] py-1 px-2 mb-1 bg-blue-gray-600 text-white"
                                    />
                                    {/* Mostrar o status do chamado */}
                                    {(() => {
                                      switch (chamado.status) {
                                        case "EM_ABERTO":
                                          return (
                                            <Chip
                                              value="Em Aberto"
                                              className="text-[11px] py-1 px-2 mb-1 bg-green-800 normal-case"
                                            />
                                          );
                                        case "EM_ANALISE":
                                          return (
                                            <Chip
                                              value="Em Análise"
                                              className="text-[11px] py-1 px-2 mb-1 bg-yellow-900 normal-case"
                                            />
                                          );
                                        case "EM_ANDAMENTO":
                                          return (
                                            <Chip
                                              value="Em Andamento"
                                              className="text-[11px] py-1 px-2 mb-1 bg-blue-600 normal-case"
                                            />
                                          );
                                        case "CONCLUIDO":
                                          return (
                                            <Chip
                                              value="Concluído"
                                              className="text-[11px] py-1 px-2 mb-1 bg-green-500 normal-case"
                                            />
                                          );
                                        case "CANCELADO":
                                          return (
                                            <Chip
                                              value="Cancelado"
                                              className="text-[11px] py-1 px-2 mb-1 bg-red-600 normal-case"
                                            />
                                          );
                                        default:
                                          return null;
                                      }
                                    })()}
                                  </div>
                                  <Chip
                                    value={chamado.prioridade.nome}
                                    className="text-[11px] py-1 px-2 mb-1 bg-blue-gray-600 text-white"
                                  />
                                  <Chip
                                    value={`# ${chamado.numeroSequencial}`}
                                    className="text-[11px] py-1 px-2 mb-1 select-text"
                                  />
                                </div>

                                <button
                                  onClick={() => acaoAbrirChamado(chamado)}
                                  className="flex flex-col justify-start normal-case text-sm font-normal bg-[#394152] text-white p-2 rounded-lg hover:bg-gray-600 max-h-[100px] overflow-y-auto custom-scrollbar w-full"
                                >
                                  <Typography variant="small">
                                    <span className="font-bold">Cliente: </span>
                                    {chamado.cliente.nome}
                                  </Typography>
                                  <div className="flex flex-start items-start gap-1">
                                    <span className="font-bold">Titulo:</span>
                                    <p className="whitespace-normal break-all text-start">
                                      {chamado.titulo}
                                    </p>
                                  </div>
                                </button>
                              </div>
                            ))
                          ) : (
                            <Typography
                              variant="small"
                              className="text-gray-500"
                            >
                              Nenhum chamado arquivado.
                            </Typography>
                          )
                        ) : // Mostrar chamados não arquivados e não concluídos
                        filtrarChamados(
                            chamadosPorQuadro[quadro.id]?.filter(
                              (chamado) =>
                                !chamado.arquivado &&
                                chamado.status !== "CONCLUIDO"
                            ),
                            quadro.id
                          )?.length > 0 ? (
                          filtrarChamados(
                            chamadosPorQuadro[quadro.id]?.filter(
                              (chamado) =>
                                !chamado.arquivado &&
                                chamado.status !== "CONCLUIDO"
                            ),
                            quadro.id
                          ).map((chamado) => (
                            <div
                              key={chamado.numeroSequencial}
                              className="pt-1"
                            >
                              <div className="flex justify-between">
                                <div className="flex gap-1">
                                  <Chip
                                    value={formatarData(chamado.criadoEm)}
                                    className="text-[11px] py-1 px-2 mb-1 bg-blue-gray-600 text-white"
                                  />
                                  {/* Mostrar o status do chamado */}
                                  {(() => {
                                    switch (chamado.status) {
                                      case "EM_ABERTO":
                                        return (
                                          <Chip
                                            value="Em Aberto"
                                            className="text-[11px] py-1 px-2 mb-1 bg-green-800 normal-case"
                                          />
                                        );
                                      case "EM_ANALISE":
                                        return (
                                          <Chip
                                            value="Em Análise"
                                            className="text-[11px] py-1 px-2 mb-1 bg-yellow-900 normal-case"
                                          />
                                        );
                                      case "EM_ANDAMENTO":
                                        return (
                                          <Chip
                                            value="Em Andamento"
                                            className="text-[11px] py-1 px-2 mb-1 bg-blue-600 normal-case"
                                          />
                                        );
                                      case "CANCELADO":
                                        return (
                                          <Chip
                                            value="Cancelado"
                                            className="text-[11px] py-1 px-2 mb-1 bg-red-600 normal-case"
                                          />
                                        );
                                      default:
                                        return null;
                                    }
                                  })()}
                                <Chip
                                    value={chamado.prioridade.nome}
                                    className="text-[11px] py-1 px-2 mb-1 bg-blue-gray-600 text-white"
                                  />
                                </div>
                                <Chip
                                  value={`# ${chamado.numeroSequencial}`}
                                  className="text-[11px] py-1 px-2 mb-1 select-text"
                                />
                              </div>

                              <button
                                onClick={() => acaoAbrirChamado(chamado)}
                                className="flex flex-col justify-start normal-case text-sm font-normal bg-[#394152] text-white p-2 rounded-lg hover:bg-gray-600 max-h-[100px] overflow-y-auto custom-scrollbar w-full"
                              >
                                <Typography variant="small">
                                  <span className="font-bold">Cliente: </span>
                                  {chamado.cliente.nome}
                                </Typography>
                                <div className="flex flex-start items-start gap-1">
                                  <span className="font-bold">Titulo:</span>
                                  <p className="whitespace-normal break-all text-start">
                                    {chamado.titulo}
                                  </p>
                                </div>
                              </button>
                            </div>
                          ))
                        ) : (
                          <Typography variant="small" className="text-gray-500">
                            Nenhum chamado ativo.
                          </Typography>
                        )}
                      </CardBody>
                    </div>
                    <CardFooter className="p-4 px-6 ">
                      <Button
                        variant="filled"
                        fullWidth
                        className="bg-[#3bb166] hover:bg-[#4ade80] text-black"
                        onClick={() => acaoBotaoNovoChamado(quadro.id)}
                      >
                        Adicionar Chamado
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div>Não há quadros</div>
              )}
            </div>
          </div>
        </div>
        <ModalCadChamado
          tipoModal={tipoModalCadChamado}
          isOpen={isOpenCadChamado}
          setModalOpen={() => setIsOpenCadChamado(!isOpenCadChamado)}
          idSetor={decryptedIdSetor}
          idWorkspace={decryptedIdWorkspace}
          idQuadro={idQuadroNovoChamado}
          atualizarChamados={atualizaQuadrosChamados}
        />

        <ModalCadQuadro
          isOpen={isOpenCadQuadro}
          setModalOpen={() => setIsOpenCadQuadro(!isOpenCadQuadro)}
          tipoModal={tipoModalCadQuadro}
          idSetor={decryptedIdSetor}
          atualizarQuadros={atualizaQuadrosChamados}
          quadroId={idQuadroEditar}
          userId={userId}
        />

        {openChamado ? (
          <ModalChamado
            isOpen={isOpenChamado}
            setModalOpen={() => setIsOpenChamado(!isOpenChamado)}
            chamado={openChamado}
            limpaChamado={limparChamado}
            idSetor={decryptedIdSetor}
            idWorkspace={decryptedIdWorkspace}
            idMembro={membroDaWorkspace.id}
            atualizaChamadosQuadro={atualizaQuadrosChamados}
            listaQuadros={quadros}
          />
        ) : null}
      </main>
    );
  } else {
    router.push("/");
  }
};

export default Setor;
