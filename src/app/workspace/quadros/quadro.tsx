import { useCallback, useEffect, useState } from "react";
import Loading from "../Loading";
import { GoGear } from "react-icons/go";

type Quadro = {
  idWorkspace: string;
};

type quadros = {
  id: number;
  nome: string;
};

type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
};

export default function Quadro(props: Quadro) {
  const [quadros, setQuadros] = useState<quadros[]>([]);
  const [carregando, setCarregando] = useState(true); // Estado para rastrear o carregamento
  const [chamados, setChamados] = useState<Chamado[]>([
    // Lista de chamados de teste
    {
      id: 1,
      titulo: "Problema no login",
      descricao: "O usuário não consegue fazer login.",
    },
    {
      id: 2,
      titulo: "Erro no servidor",
      descricao: "Erro 500 ao tentar acessar o servidor.",
    },
    {
      id: 3,
      titulo: "Falha na rede",
      descricao: "A rede está intermitente desde ontem.",
    },
  ]);

  const listaQuadros = async () => {
    try {
      const response = await fetch(
        "/api/quadros?workspaceId=" + props.idWorkspace
      );
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setQuadros(data);
      } else {
        console.error("Erro: data.quadros é undefined ou não é um array");
      }
    } catch (error) {
      console.error("Erro ao carregar os quadros:", error);
    }
    setCarregando(false); // Finaliza o carregamento após a requisição
  };

  useEffect(() => {
    listaQuadros();
  }, []);

  const adicionarChamado = () => {
    // Implemente a lógica para adicionar um novo chamado
  };

  const editarQuadro = (id: number) => {
    // Implemente a lógica para editar um chamado existente
  };

  const excluirQuadro = (id: number) => {
    // Implemente a lógica para excluir um chamado
  };

  if (carregando) {
    // Aguardando verificação quadros
    return <Loading />;
  } else {
    return (
      <div className="p-2  gap-2 ">
        {quadros.length > 0 ? (
          quadros.map((quadro, index) => (
            <div key={index} className="p-2 rounded-lg border bg-gray-700 mb-2">
              <div className=" top-0 rounded-lg p-1 shadow-lg">
                <div className="flex justify-between gap-2 mb-2 items-center rounded-lg px-1 hover:bg-gray-600">
                  <a> {quadro.nome} </a>
                  <div className="flex justify-end gap-2 py-2 items-center">
                    <button
                      onClick={adicionarChamado}
                      className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold py-1 px-2 rounded"
                    >
                      + Tarefa
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded shadow">
                      <GoGear />
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto max-h-80">
                {chamados.map((chamado) => (
                  <div key={chamado.id} className="border p-4 rounded mb-2">
                    <h3 className="font-bold">{chamado.titulo}</h3>
                    <p>{chamado.descricao}</p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => editarQuadro(chamado.id)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirQuadro(chamado.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>Não há quadros disponíveis.</div>
        )}
      </div>
    );
  }
}
