"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  Card,
  CardBody,
  Typography,
  Alert,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { IoClose } from "react-icons/io5";
import { IoMdAdd, IoMdDoneAll } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaEdit, FaInfoCircle, FaSave } from "react-icons/fa";
import { FaRegEnvelopeOpen } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Chamado, Quadro } from "../../page";
import { buscarClientes } from "@/app/lib/WorkspaceFunctions/Clientes/buscaClientesDaWorkspace";
import { Cliente, Prioridade } from "../Modals/modalCadChamado";
import { listaPrioridades } from "@/app/lib/PrioridadesFunctions/libListaPrioridades";
import { useParams } from "next/navigation";
import SelectClientes from "@/app/components/selects/SelectClientes";
import SelectStatus from "@/app/components/selects/selectStatusChamado";
import SelectPrioridades from "@/app/components/selects/selectPrioridades";
import { listaHistoricoChamado } from "@/app/lib/ChamadosFunctions/Historico/libBuscarHistorico";
import { inserirHistorico } from "@/app/lib/ChamadosFunctions/Historico/libInserirHistorico";
import { updateChamado } from "@/app/lib/ChamadosFunctions/libAlterarChamado";
import ModalAdicionarMembro from "./modalMembrosChamado";
import { removeMembro } from "@/app/lib/ChamadosFunctions/libManipularMembro";
import { buscaChamado } from "@/app/lib/ChamadosFunctions/libListarChamados";
import { FaRegSave } from "react-icons/fa";
import { BsBoxArrowRight } from "react-icons/bs";
import ModalTtransferir from "./modalTransferir";
import { statusOptions } from "@/app/components/selects/selectStatusChamado";
import ModalFinalizar from "./modalFinalizarChamado";
import ModalReabrir from "./modalReabrirChamado";

type propsModalChamado = {
  isOpen: boolean;
  setModalOpen: () => void;
  chamado: Chamado;
  limpaChamado: () => void;
  idSetor: number;
  idWorkspace: number;
  idMembro: number;
  atualizaChamadosQuadro: (idQuadro?: number) => void;
  listaQuadros: Quadro[];
};

type Historico = {
  id: number;
  chamadoId: number;
  alteradoPorId: number;
  nomeUsuario: string;
  tipo: string;
  descricao: string;
  valorAnterior: number | string;
  nomeAnterior: string;
  valorNovo: number | string;
  nomeNovo: string;
  criadoEm: Date;
};

export default function ModalChamado(props: propsModalChamado) {
  const { idWorkspace, idSetor } = useParams();
  const [comentario, setComentario] = useState("");
  const onChangeComentario = ({ target }) => setComentario(target.value);
  const [loading, setLoading] = useState(true);

  //isOpens de modals
  const [isOpenModalAddMembro, setIsOpenModalAddMembro] = useState(false);
  const [isOpenModalTransferir, setIsOpenModalTransferir] = useState(false);
  const [isOpenModalFinalizar, setIsOpenModalFinalizar] = useState(false);
  const [isOpenModalReabrir, setIsOpenModalReabrir] = useState(false);

  const [titulo, setTitulo] = useState<string>("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [status, setStatus] = useState<string>(props.chamado.status);

  const [listaDePrioridades, setListaDePrioridades] = useState<Prioridade[]>(
    []
  );
  const [idPrioridade, setIdPrioridade] = useState<number>();
  const [prioridadeChamado, setPrioridadeChamado] = useState<Prioridade>();
  const [descricao, setDescricao] = useState<string>();
  const [historico, setHistorico] = useState<Historico[]>([]);

  const [listaMembrosChamado, setListaMembrosChamado] = useState<
    { user: { id: number; nome: string } }[]
  >([]);

  const acaoBotaoCancelar = () => {
    props.setModalOpen();
    setComentario("");
    setCliente(null);
    setStatus(null);
    setIdPrioridade(null);
    setDescricao(null);
    setHistorico(null);
  };

  const acaoFinalizarChamado = async () => {
    setIsOpenModalFinalizar(!isOpenModalFinalizar);
  };

  const acaoReabrirChamado = async () => {
    setIsOpenModalReabrir(!isOpenModalReabrir);
  };

  const handleClienteChange = (selectedOption: Cliente | null) => {
    setCliente(selectedOption);
  };

  const clienteOptions = clientes.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    cpfCnpj: cliente.cpfCnpj,
  }));

  const acaoAbrirModalMembros = () => {
    setIsOpenModalAddMembro(!isOpenModalAddMembro);
  };

  const atualizaMembrosChamado = async () => {
    try {
      const chamado = await buscaChamado(props.chamado.id);
      setListaMembrosChamado(chamado.users);
    } catch (error) {
      console.log("Erro ao buscar chamado", error);
    }
  };

  const removerMembroDoChamado = async (idUser: number) => {
    if (listaMembrosChamado.length > 1) {
      try {
        const membroRemovido = await removeMembro(props.chamado.id, idUser);
        if (membroRemovido) {
          props.atualizaChamadosQuadro(props.chamado.quadroId);
          atualizaMembrosChamado();
        }
      } catch (error) {
        console.error("Erro ao remover membro do chamado:", error);
      }
    } else {
      alert("O chamado não pode ficar sem membros.");
    }
  };

  const AtualizaListaPrioridades = async () => {
    const result = await listaPrioridades(props.idSetor);
    setListaDePrioridades(result);
  };

  const atualizarHistorico = async () => {
    try {
      const resultHistorico = await listaHistoricoChamado(props.chamado.id);
      setHistorico(resultHistorico);
    } catch (error) {
      console.error("Erro ao buscar histórico do chamado:", error);
    }
  };

  const inserirComentario = async () => {
    if (comentario) {
      try {
        const novoComentario = await novoHistorico("COMENTARIO", comentario);
        if (novoComentario) {
          atualizarHistorico();
          setComentario("");
        }
      } catch (error) {
        console.error("Erro ao inserir comentário:", error);
      }
    }
  };

  const novoHistorico = async (
    tipo: string,
    descriacoHistorico: string,
    valorAnterior?: string,
    valorNovo?: string
  ) => {
    try {
      const historico = await inserirHistorico(
        props.chamado.id,
        props.idMembro,
        tipo,
        descriacoHistorico,
        valorAnterior,
        valorNovo
      );
      if (historico) {
        return historico;
      }
    } catch (error) {
      console.error("Erro ao inserir histórico:", error);
    }
  };

  const salvarAlteracoes = async () => {
    if (!cliente) {
      alert("Selecione um cliente para continuar.");
      return;
    }

    const atualizacoes: {
      novoTitulo?: string;
      novoStatus?: string;
      idNovaPrioridade?: number;
      novaDescricao?: string;
      idNovoCliente?: number;
    } = {};

    if (props.chamado.titulo !== titulo) {
      atualizacoes.novoTitulo = titulo;
    }

    if (props.chamado.status !== status) {
      atualizacoes.novoStatus = status;
    }

    if (props.chamado.prioridadeId !== idPrioridade) {
      atualizacoes.idNovaPrioridade = idPrioridade;
    }

    if (props.chamado.descricao !== descricao) {
      atualizacoes.novaDescricao = descricao;
    }

    if (props.chamado.clienteId !== cliente?.id) {
      atualizacoes.idNovoCliente = cliente?.id;
    }

    if (Object.keys(atualizacoes).length > 0) {
      try {
        const result = await updateChamado(
          props.chamado.id,
          atualizacoes.novoTitulo,
          atualizacoes.novoStatus,
          atualizacoes.idNovaPrioridade,
          atualizacoes.novaDescricao,
          atualizacoes.idNovoCliente
        );

        if (result) {
          const novoHistoricoPromises = [];

          if (atualizacoes.novoTitulo) {
            novoHistoricoPromises.push(
              novoHistorico(
                "Titulo",
                "alterou o titulo",
                String(props.chamado.titulo),
                String(titulo)
              )
            );
            setTitulo(atualizacoes.novoTitulo);
          }
          if (atualizacoes.novoStatus) {
            novoHistoricoPromises.push(
              novoHistorico(
                "Status",
                "alterou o status",
                String(props.chamado.status),
                String(status)
              )
            );
            setStatus(atualizacoes.novoStatus);
          }
          if (atualizacoes.idNovaPrioridade) {
            novoHistoricoPromises.push(
              novoHistorico(
                "Prioridade",
                "alterou a prioridade",
                String(props.chamado.prioridadeId),
                String(idPrioridade)
              )
            );
            setIdPrioridade(atualizacoes.idNovaPrioridade);
          }
          if (atualizacoes.novaDescricao) {
            novoHistoricoPromises.push(
              novoHistorico(
                "Descrição",
                "alterou a descrição",
                props.chamado.descricao,
                descricao
              )
            );
            setDescricao(atualizacoes.novaDescricao);
          }
          if (atualizacoes.idNovoCliente) {
            novoHistoricoPromises.push(
              novoHistorico(
                "Cliente",
                "alterou o cliente",
                String(props.chamado.clienteId),
                String(cliente?.id)
              )
            );
            setCliente(
              clientes.find((c) => c.id === atualizacoes.idNovoCliente)
            );
          }

          // Aguarde todas as promessas de histórico serem resolvidas
          await Promise.all(novoHistoricoPromises);

          console.log("Alterações salvas e histórico registrado com sucesso.");
          props.atualizaChamadosQuadro(props.chamado.quadroId);
          acaoBotaoCancelar();
        }
      } catch (error) {
        console.error("Erro ao atualizar chamado:", error);
      }
    } else {
      acaoBotaoCancelar();
    }
  };

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
    const fetchData = async () => {
      setLoading(true); // Iniciar carregamento
      try {
        if (props.idSetor && props.idWorkspace) {
          const listaClientes = await buscarClientes(props.idWorkspace);
          setClientes(listaClientes);

          const resultPrioridades = await listaPrioridades(props.idSetor);
          setListaDePrioridades(resultPrioridades);
        } else {
          try {
            // Chave de criptografia (garantindo que ela existe)
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
              const listaClientes = await buscarClientes(
                Number(decryptedWorkspaceId)
              );
              setClientes(listaClientes);

              const resultPrioridades = await listaPrioridades(
                Number(decryptedSetorId)
              );
              setListaDePrioridades(resultPrioridades);

              const resultHistorico = await listaHistoricoChamado(
                props.chamado.id
              );
              setHistorico(resultHistorico);

              console.log(resultHistorico);
            } else {
              console.error("Erro ao descriptografar os IDs.");
            }
          } catch (error) {
            console.error("Erro ao buscar clientes:", error);
          }
        }
      } catch (error) {
        console.error("Erro ao descriptografar dados:", error);
      } finally {
        setLoading(false); // Fim do carregamento
      }
    };

    fetchData();
  }, [idWorkspace, idSetor]);

  useEffect(() => {
    // Garantir que os dados foram carregados antes de tentar setar os valores
    if (props.isOpen && clientes.length > 0) {
      // Atualiza cliente
      const clienteSelecionado = clientes.find(
        (c) => c.id === props.chamado.clienteId
      );
      setCliente(clienteSelecionado || null);

      const prioridadeSelecionado = listaDePrioridades.find(
        (p) => p.id === props.chamado.prioridadeId
      );

      setStatus(props.chamado.status);
      setIdPrioridade(prioridadeSelecionado ? prioridadeSelecionado.id : null);
      setPrioridadeChamado(prioridadeSelecionado || null);
      setDescricao(props.chamado.descricao);
      setTitulo(props.chamado.titulo);
      setEditarTitulo(false);
    }
  }, [
    props.isOpen,
    clientes,
    listaDePrioridades,
    props.chamado.titulo,
    props.chamado.clienteId,
    props.chamado.status,
    props.chamado.prioridadeId,
  ]);

  useEffect(() => {
    setListaMembrosChamado([]);
    const fetchData = async () => {
      if (props.isOpen) {
        try {
          const resultHistorico = await listaHistoricoChamado(props.chamado.id);
          setHistorico(resultHistorico);
        } catch (error) {
          console.error("Erro ao buscar histórico do chamado:", error);
        }
        atualizaMembrosChamado();
      }
    };

    fetchData();
  }, [props.chamado]);

  const [editarTitulo, setEditarTitulo] = useState(false);

  return (
    <Dialog
      size="xl"
      open={props.isOpen}
      handler={props.setModalOpen}
      className="bg-transparent shadow-none h-[90%] overflow-y-auto custom-scrollbar "
      dismiss={{ enabled: true }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Typography variant="h4" color="white">
            Carregando...
          </Typography>
        </div>
      ) : (
        <Card className="flex flex-row mx-auto w-full bg-[#323941] custom-scrollbar ">
          {/* Lado esquerdo - Dados principais */}
          <CardBody className="flex flex-col gap-4 w-3/4">
            <div className="flex flex-row justify-between">
              <div className="flex gap-2 items-center w-full pr-2">
                <strong className="text-white font-bold">Titulo: </strong>
                {editarTitulo ? (
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-transparent rounded border-white text-white break-all text-start p-1"
                    autoFocus={true}
                  />
                ) : (
                  <strong className="text-white font-bold w-full p-1  break-all text-start">
                    {titulo}
                  </strong>
                )}
                <button
                  onClick={() => setEditarTitulo(!editarTitulo)}
                  className="text-white bg-gray-800 p-1 rounded"
                >
                  {editarTitulo ? <FaSave /> : <FaEdit />}
                </button>
              </div>
              <Typography
                variant="h5"
                color="white"
                className="bg-[#2C2F35] text-white text-center rounded  p-2"
              >
                #{props.chamado.numeroSequencial}
              </Typography>
            </div>
            <div>
              <SelectClientes
                options={clienteOptions}
                value={cliente}
                onChange={handleClienteChange}
                placeholder="Selecionar cliente..."
                isDisabled={props.chamado.solucao ? true : false}
              />
            </div>
            <Typography
              variant="paragraph"
              color="white"
              className="font-bold "
            >
              Descrição:
            </Typography>
            <textarea
              value={descricao ? descricao : ""}
              onChange={(e) => setDescricao(e.target.value)}
              className={`bg-[#2C2F35] text-white rounded border-white border p-2 min-h-72 resize-none`}
              disabled={props.chamado.solucao ? true : false}
            ></textarea>

            {props.chamado.concluidoEm && props.chamado.solucao ? (
              <div>
                <h4 className="text-white">Solução:</h4>
                <Alert color="light-green" className="text-black">
                  {props.chamado.solucao}
                </Alert>
              </div>
            ) : null}

            {/* Campo para adicionar comentário */}
            <div className="relative flex flex-col w-full">
              <span className="text-white ml-1 mb-1">Faça um Comentario:</span>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  value={comentario}
                  onChange={onChangeComentario}
                  className="bg-transparent  text-white focus:outline-none"
                  disabled={props.chamado.solucao ? true : false}
                ></input>
                <button
                  disabled={!comentario}
                  className={`rounded w-20 h-11 p-2 transition-all bg-gray-700 text-white ${
                    comentario ? "hover:bg-gray-600" : "opacity-50"
                  }`}
                  onClick={inserirComentario}
                >
                  Enviar
                </button>
              </div>
            </div>

            {/* Histórico do chamado */}
            <Typography variant="h6" color="white">
              Histórico do Chamado:
            </Typography>
            <div>
              {historico && historico.length > 0 ? (
                historico.map((item, index) => {
                  let nomeAnterior;
                  let nomeNovo;

                  if (item.tipo === "Status") {
                  }
                  nomeAnterior = statusOptions.find(
                    (status) => status.value === item.nomeAnterior
                  )?.nome;

                  nomeNovo = statusOptions.find(
                    (status) => status.value === item.nomeNovo
                  )?.nome;

                  return (
                    <div
                      key={index}
                      className="flex flex-col text-gray-500 p-1"
                    >
                      <span className="text-xs ml-0.5">
                        {formatarData(item.criadoEm)}
                      </span>
                      <Typography className="text-sm bg-[#22272b] rounded text-white px-2 py-1 break-word">
                        {item.tipo === "Descrição" ? (
                          <>
                            <strong className="font-bold">
                              {item.nomeUsuario}
                            </strong>{" "}
                            {item.descricao}.
                            <strong className="relative inline-block group ml-2">
                              <FaInfoCircle
                                className="text-blue-500"
                                title={String(item.valorAnterior)}
                              />
                            </strong>
                          </>
                        ) : item.tipo === "COMENTARIO" ? (
                          <>
                            <strong className="font-bold">
                              {item.nomeUsuario}
                            </strong>{" "}
                            comentou: {item.descricao}
                          </>
                        ) : item.tipo === "Status" ? (
                          <strong className="flex gap-1 items-center">
                            <strong className="font-bold">
                              {item.nomeUsuario}
                            </strong>{" "}
                            {item.descricao}
                            <strong className="font-bold">
                              {nomeAnterior}
                            </strong>
                            <strong>
                              <IoIosArrowRoundForward size={20} />
                            </strong>
                            <strong className="font-bold">{nomeNovo}.</strong>
                          </strong>
                        ) : item.tipo === "FINALIZADO" ||
                          item.tipo === "REABERTO" ? (
                          <strong className="flex gap-1 items-center">
                            <strong className="font-bold">
                              {item.nomeUsuario}
                            </strong>{" "}
                            {item.descricao}.
                          </strong>
                        ) : item.tipo === "TRANSFERIDO" ? (
                          <strong className="flex gap-1 items-center">
                            <strong className="font-bold">
                              {item.nomeUsuario}
                            </strong>{" "}
                            {item.descricao}
                            <strong className="font-bold">
                              {item.valorAnterior}
                            </strong>
                            <strong>
                              <IoIosArrowRoundForward size={20} />
                            </strong>
                            <strong className="font-bold">
                              {item.valorNovo}.
                            </strong>
                          </strong>
                        ) : (
                          <strong className="flex gap-1 items-center">
                            <strong className="font-bold">
                              {item.nomeUsuario}
                            </strong>{" "}
                            {item.descricao}
                            <strong className="font-bold">
                              {item.nomeAnterior}
                            </strong>
                            <strong>
                              <IoIosArrowRoundForward size={20} />
                            </strong>
                            <strong className="font-bold">
                              {item.nomeNovo}.
                            </strong>
                          </strong>
                        )}
                      </Typography>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-500">
                  Nenhum histórico para exibir.
                </span>
              )}
            </div>
          </CardBody>

          <div className="border  border-gray-600 rounded"></div>

          {/* Lado direito - Membros e botão de adicionar membros */}
          <div className="bg-[#394152] p-4 rounded-r w-[25%] max-lg:w-[30%]">
            <div className="flex justify-end text-gray-500 flex-col items-end">
              <button onClick={acaoBotaoCancelar}>
                <IoClose size={25} />
              </button>
            </div>

            <div className="flex flex-col gap-4 justify-center mt-8 ">
              <button
                title="Salvar"
                className={`
                  ${
                    props.chamado.solucao
                      ? "opacity-50 "
                      : "hover:bg-gradient-to-r hover:from-light-blue-500 hover:to-light-blue-700"
                  }
                  flex bg-gradient-to-r from-light-blue-400 to-blue-600 items-center justify-start gap-4 text-sm  text-black font-semibold py-2 px-4 rounded  transition-all duration-300 ease-in-out`}
                onClick={salvarAlteracoes}
                disabled={!!props.chamado.solucao}
              >
                <FaRegSave size={20} />
                Salvar
              </button>

              <button
                title="Transferir"
                className={`
                  ${
                    props.chamado.solucao
                      ? "opacity-50 "
                      : "hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-700"
                  }
                  flex items-center justify-start gap-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm  font-semibold py-2 px-4 rounded  transition-all duration-300 ease-in-out`}
                onClick={() => setIsOpenModalTransferir(true)}
                disabled={!!props.chamado.solucao}
              >
                <BsBoxArrowRight size={20} />
                Transferir
              </button>

              {props.chamado.solucao ? (
                <button
                  title="Reabrir"
                  onClick={acaoReabrirChamado}
                  className="flex items-center justify-start gap-4 bg-white text-black text-sm  font-semibold py-2 px-4 rounded hover:bg-gray-200 transition-all duration-300 ease-in-out"
                >
                  <RiArrowGoBackFill size={20} />
                  Reabrir
                </button>
              ) : (
                <button
                  title="Concluir"
                  onClick={acaoFinalizarChamado}
                  className="flex items-center justify-start gap-4 bg-gradient-to-r from-green-400 to-green-600 text-sm  text-black font-semibold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 transition-all duration-300 ease-in-out"
                >
                  <IoMdDoneAll size={20} />
                  Concluir
                </button>
              )}
            </div>

            <div className="flex justify-between items-center pt-8 ">
              <Typography variant="h5" color="white">
                Membros
              </Typography>
              <button
                className={`
                  ${
                    props.chamado.solucao
                      ? "cursor-not-allowed"
                      : "hover:bg-green-600 hover:text-white"
                  }
                  rounded-full flex items-center justify-center text-gray-600 hover:transition-all hover:delay-50`}
                onClick={acaoAbrirModalMembros}
                disabled={props.chamado.solucao ? true : false}
              >
                <IoMdAdd size={25} className="" />
              </button>
            </div>
            <div className="my-4 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar border rounded p-1.5 border-gray-600">
              {listaMembrosChamado.length === 0 ? (
                <p className="text-white">Carregando...</p>
              ) : (
                listaMembrosChamado.map((member, index) => (
                  <div key={index} className="w-full">
                    <span className="flex items-center justify-between text-sm text-white bg-black rounded py-1 px-2">
                      {member.user.nome}{" "}
                      <button
                        onClick={() => removerMembroDoChamado(member.user.id)}
                        className={`${
                          props.chamado.solucao
                            ? "cursor-not-allowed"
                            : "hover:bg-gray-600"
                        } ml-1 rounded p-0.5`}
                        disabled={props.chamado.solucao ? true : false}
                      >
                        <IoClose />
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4">
              <SelectStatus
                setorId={props.idSetor}
                setarStatus={setStatus}
                valorInicial={props.chamado.status}
                isDisabled={props.chamado.solucao ? true : false}
              />

              <SelectPrioridades
                listaPrioridades={listaDePrioridades}
                atualizaLista={AtualizaListaPrioridades}
                setorId={props.idSetor}
                setarIdPrioridade={setIdPrioridade}
                valorInicial={prioridadeChamado}
                isDisabled={props.chamado.solucao ? true : false}
              />

              {isOpenModalAddMembro && (
                <ModalAdicionarMembro
                  isOpen={isOpenModalAddMembro}
                  setarIsOpen={() =>
                    setIsOpenModalAddMembro(!isOpenModalAddMembro)
                  }
                  setorId={props.idSetor}
                  membrosChamado={listaMembrosChamado}
                  chamadoId={props.chamado.id}
                  atualizaMembrosChamados={atualizaMembrosChamado}
                />
              )}

              {isOpenModalTransferir && (
                <ModalTtransferir
                  isOpen={isOpenModalTransferir}
                  setIsOpen={() =>
                    setIsOpenModalTransferir(!isOpenModalTransferir)
                  }
                  listaQuadros={props.listaQuadros}
                  quadroDoChamado={props.listaQuadros.find(
                    (q) => q.id === props.chamado.quadroId
                  )}
                  idChamado={props.chamado.id}
                  fecharModalChamado={acaoBotaoCancelar}
                  atualizaChamados={props.atualizaChamadosQuadro}
                  idMembro={props.idMembro}
                />
              )}

              {isOpenModalFinalizar && (
                <ModalFinalizar
                  isOpen={isOpenModalFinalizar}
                  setIsOpen={() =>
                    setIsOpenModalFinalizar(!isOpenModalFinalizar)
                  }
                  idChamado={props.chamado.id}
                  atualizaChamados={props.atualizaChamadosQuadro}
                  fecharModalChamado={acaoBotaoCancelar}
                  idMembro={props.idMembro}
                />
              )}

              {isOpenModalReabrir && (
                <ModalReabrir
                  isOpen={isOpenModalReabrir}
                  setIsOpen={() => setIsOpenModalReabrir(!isOpenModalReabrir)}
                  idChamado={props.chamado.id}
                  atualizaChamados={props.atualizaChamadosQuadro}
                  fecharModalChamado={acaoBotaoCancelar}
                  idMembro={props.idMembro}
                />
              )}
            </div>
          </div>
        </Card>
      )}
    </Dialog>
  );
}
