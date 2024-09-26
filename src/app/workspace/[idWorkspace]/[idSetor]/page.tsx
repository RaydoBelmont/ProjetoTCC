"use client";

import { useParams } from "next/navigation";
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
import CryptoJS from "crypto-js";
import ModalCadChamado from "./quadros/Modals/modalCadChamado";
import ModalChamado from "./quadros/Modals/modalChamado";

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

type Quadro = {
  id: number;
  nome: string;
  chamados: Chamado[];
};

const Setor: React.FC = () => {
  const { idWorkspace, idSetor } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCadChamado, setIsOpenCadChamado] = useState<boolean>(false);
  const [isOpenChamado, setIsOpenChamado] = useState<boolean>(false);
  const [openChamado, setOpenChamado] = useState<Chamado>(null);
  const [tipoModal, setTipoModal] = useState<string>("");
  const [tipoModalCadChamado, setTipoModalCadChamado] = useState<string>("");
  const [quadros, setQuadros] = useState<Quadro[]>([]);
  const [chamadosPorQuadro, setChamadosPorQuadro] = useState<{
    [key: number]: Chamado[];
  }>({});
  const [carregandoTodosChamados, setCarregandoTodosChamados] = useState(true);
  const [decryptedIdSetor, setDecryptedIdSetor] = useState<number>();
  const [decryptedIdWorkspace, setDecryptedIdWorkspace] = useState<number>();
  const [idQUadroEditar, setIdQuadroEditar] = useState<number>();
  const [idQuadroNovoChamado, setIdQuadroNovoChamado] = useState<number>();

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
    setTipoModal("EDITAR");
    setIdQuadroEditar(idQuadro);
    setIsOpen(true);
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
    setOpenChamado(null)
  }

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
    const decryptedSetorId = decryptedSetorIdBytes.toString(CryptoJS.enc.Utf8);

    if (decryptedWorkspaceId && decryptedSetorId) {
      setDecryptedIdWorkspace(Number(decryptedWorkspaceId));
      setDecryptedIdSetor(Number(decryptedSetorId));
      getQuadrosEChamados(Number(decryptedSetorId));
    }
  }, [idSetor]);

  return (
    <main>
      <div className="w-full flex flex-col items-center ">
        <NavbarSetor
          idSetor={Number(idSetor)}
          idWorkspace={Number(idWorkspace)}
          isOpen={isOpen}
          setModalOpen={() => setIsOpen(!isOpen)}
          setTipoModal={() => setTipoModal("INSERIR")}
          tipoModal={tipoModal}
        />
        <div className="flex flex-col w-full p-2 gap-y-4 justify-center items-center">
          <Typography variant="h3">Quadros da Softgran</Typography>
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
                    <h3 className="text-black text-lg px-2 py-1.5 text-center font-bold ">
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
                  <div className="flex flex-col justify-between h-full overflow-y-auto  custom-scrollbar ">
                    <CardBody className="flex flex-col space-y-2 pb-4 pt-4 ">
                      {carregandoTodosChamados ? (
                        <Typography variant="small" className="text-gray-500">
                          Carregando chamados...
                        </Typography>
                      ) : chamadosPorQuadro[quadro.id]?.length > 0 ? (
                        chamadosPorQuadro[quadro.id].map((chamado) => (
                          <div key={chamado.numeroSequencial} className="pt-1">
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

                            <Button
                              onClick={() => acaoAbrirChamado(chamado)}
                              variant="text"
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
                            </Button>
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
        isOpen={isOpen}
        setModalOpen={() => setIsOpen(!isOpen)}
        tipoModal={tipoModal}
        idSetor={decryptedIdSetor}
        atualizarQuadros={atualizaQuadrosChamados}
        quadroId={idQUadroEditar}
      />

      {openChamado ? (
        <ModalChamado
          isOpen={isOpenChamado}
          setModalOpen={() => setIsOpenChamado(!isOpenChamado)}
          chamado={openChamado}
          limpaChamado={limparChamado}
        />
      ) : null}
    </main>
  );
};

export default Setor;
