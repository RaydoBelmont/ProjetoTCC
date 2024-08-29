import React from "react";
import { Checkbox } from "../../../../lib/material-tailwindcss/material-tailwindcss";

type BotaoCheckBoxProps = {
  setaAtivoDesativo: () => void;
};

export function BotaoCheckBoxClientes(props: BotaoCheckBoxProps) {
  return (
    <div>
      <Checkbox
        label={"Desativados"}
        crossOrigin={""}
        onChange={props.setaAtivoDesativo}
        className="text-white"
        labelProps={{ className: "text-white mr-1" }} // Modifique a cor da label aqui
        color="light-blue"
      />
    </div>
  );
}
