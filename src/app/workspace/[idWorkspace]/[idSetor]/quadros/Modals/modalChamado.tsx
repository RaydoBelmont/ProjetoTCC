"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  CardFooter,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { Chamado } from "../../page";

type propsModalChamado = {
  isOpen: boolean;
  setModalOpen: () => void;
  chamado: Chamado;
  limpaChamado: () => void;
};

export default function ModalChamado(props: propsModalChamado) {
  const acaoBotaoCancelar = () => {
    props.setModalOpen();
    props.limpaChamado();
  };
  return (
    <Dialog
      size="xl"
      open={props.isOpen}
      handler={props.setModalOpen}
      className="bg-transparent shadow-none"
      dismiss={{ enabled: false }}
    >
      <Card className="flex flex-row mx-auto w-full max bg-[#384152]">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="white">
            {props.chamado.titulo}
          </Typography>
          <CardFooter className="pt-0 flex justify-end space-x-2">
            <Button variant="gradient" color="red" onClick={acaoBotaoCancelar}>
              Cancelar
            </Button>
            <Button type="submit" color="green">
              Salvar
            </Button>
          </CardFooter>
        </CardBody>
      </Card>
    </Dialog>
  );
}
