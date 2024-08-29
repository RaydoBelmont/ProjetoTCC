import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "../../../../lib/material-tailwindcss/material-tailwindcss";
import { FaTrashAlt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

type botaoDialogoProps = {
  acaoConfirmar: (idCliente: number) => void;
  idCliente: number;
  acao: string; // Tipo de ação, como "Desativar" ou "Ativar"
};

export function BotaoDialogo(props: botaoDialogoProps) {
  const [size, setSize] = useState<string | null>(null);

  const acaoConfirmar = () => {
    setSize(null);
    console.log("passou pelo setSize");
    props.acaoConfirmar(props.idCliente);
    console.log("passou pelo acaoConfirmar");
  };

  const handleOpen = (value: string | null) => setSize(value);

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="filled"
          onClick={() => handleOpen("xs")}
          className={`${
            props.acao === "Desativar" ? "bg-red-500 px-2 py-2"  : "bg-blue-500"
          } text-white px-4 py-2 rounded hover:opacity-80 transition`}
        >
          {props.acao === "Desativar" ? (
            <>
              <FaTrashAlt className="h-6 w-6" />
            </>
          ) : props.acao === "Ativar" ? (
            <><FaCircleCheck className="h-6 w-6" /></>
          ) : (
            "Ação desconhecida"
          )}
        </Button>
      </div>
      <Dialog
        open={size === "xs"}
        size={"xs"}
        handler={handleOpen}
        className="bg-[#384152]"
      >
        <DialogHeader className="text-white">
          {props.acao === "Desativar"
            ? "Desativar Cliente"
            : props.acao === "Ativar"
            ? "Ativar Cliente"
            : "Ação desconhecida"}
        </DialogHeader>
        <hr className="border-t border-gray-600 mx-3 " />
        <DialogBody className="text-white">
          {props.acao === "Desativar"
            ? "Essa ação irá desativar o cliente, deseja realmente continuar?"
            : props.acao === "Ativar"
            ? "Essa ação irá ativar o cliente, deseja realmente continuar?"
            : "Ação desconhecida"}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="red"
            onClick={() => handleOpen(null)}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={acaoConfirmar} // Chama diretamente a função
          >
            <span>Confirmar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
