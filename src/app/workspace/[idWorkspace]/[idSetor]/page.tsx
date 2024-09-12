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
} from "../../../lib/material-tailwindcss/material-tailwindcss";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import ModalCadQuadro from "./quadros/Modals/modalCadQuadro";
import { useEffect, useState } from "react";
import { buscarQuadros } from "@/app/lib/QuadrosFunctions/libBuscarQuadros";
import CryptoJS from "crypto-js";
import ModalCadChamado from "./quadros/Modals/modalCadChamado";

type Quadro = {
  id: number;
  nome: string;
};

const Setor: React.FC = () => {
  const { idWorkspace, idSetor } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCadChamado, setIsOpenCadChamado] = useState<boolean>(false)
  const [tipoModal, setTipoModal] = useState<string>("");
  const [tipoModalCadChamado, setTipoModalCadChamado] = useState<string>("");
  const [quadros, setQuadros] = useState<Quadro[]>([]);
  const [decryptedIdSetor, setDecryptedIdSetor] = useState<number>();
  const [idQUadroEditar, setIdQuadroEditar] = useState<number>()

  const atualizaQuadros = async () => {
    const listaQuadros = await buscarQuadros(decryptedIdSetor);
          if (listaQuadros) {
            setQuadros(listaQuadros);
          }else{
            console.log("Erro ao atualizar Quadros")
          }
  }

  const acaoBotaoEditar = (idQuadro: number) => {
    setTipoModal("EDITAR")
    setIdQuadroEditar(idQuadro)
    setIsOpen(true)
  }

  const acaoBotaoNovoChamado = () => {
    setIsOpenCadChamado(true)
    setTipoModalCadChamado("INSERIR")
  }

  useEffect(() => {
    const getQuadros = async () => {
      try {
        const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
        const bytes = CryptoJS.AES.decrypt(
          decodeURIComponent(String(idSetor)),
          secretKey
        );
        const decryptedSetorId = Number(
          JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        );

        if (decryptedSetorId) {
          setDecryptedIdSetor(decryptedSetorId);
          const listaQuadros = await buscarQuadros(decryptedSetorId);
          if (listaQuadros) {
            setQuadros(listaQuadros);
          }
        }
      } catch (error) {
        console.log("Erro ao tentar buscar por Quadros", error);
      }
    };

    getQuadros();
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
                    <CardBody className="flex flex-col space-y-2 pb-4 ">
                      <Button
                        variant="text"
                        className="flex flex-col justify-start normal-case text-sm font-normal bg-[#394152] text-white p-2 rounded-lg hover:bg-gray-600 max-h-[100px] overflow-y-auto custom-scrollbar "
                      >
                        <Typography variant="small">
                          <span className="font-bold">Cliente:</span> GRUPO BS
                        </Typography>
                        <Typography variant="small">
                          <span className="font-bold">Nº Chamado:</span>{" "}
                          12345234
                        </Typography>
                        <div className="flex flex-start items-start gap-1">
                          <span className="font-bold">Resumo:</span>
                          <p className="whitespace-normal break-all text-start">
                            Erro com Impressoraaaaaaaaaaaaaaaaaaa
                          </p>
                        </div>
                      </Button>
                    </CardBody>
                  </div>
                  <CardFooter className="p-4 px-6 ">
                    <Button
                      variant="filled"
                      fullWidth
                      className="bg-[#3bb166] hover:bg-[#4ade80] text-black"
                      onClick={acaoBotaoNovoChamado}
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

      <ModalCadQuadro
        isOpen={isOpen}
        setModalOpen={() => setIsOpen(!isOpen)}
        tipoModal={tipoModal}
        idSetor={decryptedIdSetor}
        atualizarQuadros={atualizaQuadros}
        quadroId={idQUadroEditar}
      />

      <ModalCadChamado tipoModal={tipoModalCadChamado} isOpen={isOpenCadChamado} setModalOpen={() => setIsOpenCadChamado(!isOpenCadChamado)}  />
    </main>
  );
};

export default Setor;
