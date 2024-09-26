import React from "react";

type InputTextAreaProps = {
  nome: string;
  valor: string | number;
  acao: string;
  setarValor: (valor: any) => void;
  linhas: number;
};

const InputTextArea: React.FC<InputTextAreaProps> = ({
  nome,
  valor,
  acao,
  setarValor,
  linhas,
}) => {
  return (
    <div className="relative w-full resize-none">
      <textarea
        className="peer custom-scrollbar h-30 w-full rounded-[7px] border bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-white outline-none transition-all placeholder-shown:border placeholder-shown:border-white focus:border-2 focus:outline-none resize-none"
        placeholder=" "
        value={valor}
        onChange={(e) => setarValor(e.target.value)}
        readOnly={acao === "Vizualizar"}
        rows={linhas}
      />
      <label
        className={`absolute transition-all left-3 mt-2 origin-[0] px-1 text-white leading-tight text-[14px] resize-none 
        ${
          valor
            ? "-top-4 left-3 scale-[0.85] bg-[#384152] text-white text-[14px]"
            : "peer-placeholder-shown:top-0 peer-placeholder-shown:left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent"
        } 
        peer-focus:-top-4 peer-focus:left-3 peer-focus:scale-[0.85] peer-focus:bg-[#384152] peer-focus:text-white peer-focus:text-[14px]`}
      >
        {nome}
      </label>
    </div>
  );
};

export default InputTextArea;
