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
import ModalCadQuadro from "./quadros/Modals/modalCadQuadro";
import { useEffect, useState } from "react";
import { buscarQuadros } from "@/app/lib/QuadrosFunctions/libBuscarQuadros";
import { listaChamados } from "@/app/lib/ChamadosFunctions/libListarChamados";
import { buscaSetor } from "@/app/lib/SetoresFunctions/listarSetoresIdWorkspaceIdUser";
import CryptoJS from "crypto-js";
import ModalCadChamado from "./quadros/Modals/modalCadChamado";
import ModalChamado from "./quadros/Modals/modalChamado";
import { useSession } from "next-auth/react";

import { getMembroParaWorkspace } from "@/app/lib/WorkspaceFunctions/Membros/buscaMembroDaWorkspace";
import { buscaIdUserPorEmail } from "@/app/lib/UserFunctions/buscaIDuser";
import Loading from "../Loading";

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
  statusId: number;
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
  status: {
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

  const getSetor = async (idSetor: number) => {
    try {
      const result = await buscaSetor(idSetor);
      setSetor(result);
      return setor;
    } catch (error) {
      console.log("Erro ao tentar buscar setor.", error);
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
          />
          <Typography variant="h3" className="pb-4">
            {setor ? "Quadros de " + setor.nome : ""}
          </Typography>
          <div className="flex flex-col w-full p-2 gap-y-4 justify-center items-start">
            <div className="flex flex-wrap p-4 gap-4 gap-y-8 items-start">
              {quadros.length > 0 ? (
                quadros.map((quadro) => (
                  <Card
                    key={quadro.id}
                    className="w-[290px] h-[420px] bg-[#202938]"
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
                      <span className="text-gray-500 p-1 text-sm text-center truncate" title={quadro.responsavel.nome}>
                        Responsavel: {quadro.responsavel.nome}
                      </span>
                      <CardBody className="flex flex-col space-y-2 pb-4 pt-4 ">
                        {carregandoTodosChamados ? (
                          <Typography variant="small" className="text-gray-500">
                            Carregando chamados...
                          </Typography>
                        ) : chamadosPorQuadro[quadro.id]?.length > 0 ? (
                          chamadosPorQuadro[quadro.id].map((chamado) => (
                            <div
                              key={chamado.numeroSequencial}
                              className="pt-1"
                            >
                              <div className="flex justify-between">
                                <Chip
                                  value={formatarData(chamado.criadoEm)}
                                  className="text-[11px] py-1 px-2 mb-1 bg-green-800"
                                ></Chip>
                                <Chip
                                  value={`# ${chamado.numeroSequencial}`}
                                  className="text-[11px] py-1 px-2 mb-1 select-text"
                                ></Chip>
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
                            Nenhum chamado registrado.
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
