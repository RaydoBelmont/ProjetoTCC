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
import { useState } from "react";

const Setor: React.FC = () => {
  const { idWorkspace, idSetor } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tipoModal, setTipoModal] = useState<string>("")

  const openModalEditar = () => {
    setIsOpen(true)
    setTipoModal("EDITAR")
  }

  return (
    <main>
      <div className="w-full flex flex-col items-center">
        <NavbarSetor
          idSetor={Number(idSetor)}
          idWorkspace={Number(idWorkspace)}
          isOpen={isOpen} 
          setModalOpen={() => setIsOpen(!isOpen)}
          setTipoModal={() => setTipoModal("INSERIR")}

        />
        <div className="flex flex-col w-full p-2 gap-8">
          <Typography variant="h3">Quadros da Softgran</Typography>
          <div className="flex flex-wrap p-4">
            {/* Lista 1 */}
            <Card className="min-w-[290px] h-[420px] bg-[#202938]">
            <CardHeader className="bg-[#07b6d5] relative flex justify-between items-center">
                {/* Botão com ícone de lixeira à esquerda */}
                <Button variant="text" className="ml-2 p-1 rounded-lg ">
                  <FaTrashAlt className="h-4 w-4 text-red-900" />
                </Button>

                <h3 className="text-black text-lg px-2 py-1.5 text-center font-bold ">
                  Lista 1
                </h3>

                {/* Botão com ícone de edição à direita */}
                <Button variant="text" onClick={openModalEditar} className="mr-2 p-1 rounded-lg">
                  <FaEdit className="h-5 w-5 text-black" />
                </Button>
              </CardHeader>
              <div className="flex flex-col justify-between h-full overflow-y-auto  custom-scrollbar ">
                <CardBody className="flex flex-col space-y-2 pb-4 ">
                  <Button
                    variant="text"
                    className="flex flex-col justify-start normal-case text-sm font-normal bg-[#394152] text-white p-2 rounded-lg hover:bg-gray-600 w-[290px] max-h-[100px] overflow-y-auto custom-scrollbar "
                  >
                    <Typography variant="small">
                      <span className="font-bold">Cliente:</span> GRUPO BS
                    </Typography>
                    <Typography variant="small">
                      <span className="font-bold">Nº Chamado:</span> 12345234
                    </Typography>
                    <div className="flex flex-start items-start gap-1">
                    <span className="font-bold">Resumo:</span>
                    <p className="whitespace-normal break-all text-start">
                      Erro com Impressora
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
                >
                  Adicionar Chamado
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <ModalCadQuadro isOpen={isOpen} setModalOpen={() => setIsOpen(!isOpen)} tipoModal={tipoModal} />
    </main>
  );
};

export default Setor;
