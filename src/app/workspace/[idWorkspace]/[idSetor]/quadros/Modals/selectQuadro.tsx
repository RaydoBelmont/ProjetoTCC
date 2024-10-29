import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Quadro } from "../../page";

type propsSelect = {
  listaDeQuadros: Quadro[];
  setarQuadro: (quadro: Quadro) => void;
  quadroDoChamado: Quadro;
};

export default function SelectQuadro(props: propsSelect) {
  const [quadroSelecionado, setQuadroSelecionado] = useState<Quadro>();
  const [isOpen, setIsOpen] = useState(false);

  const popoverRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickAway(popoverRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
  });

  const acaoSelecionarQuadro = (quadro: Quadro | null) => {
    setQuadroSelecionado(quadro);
    props.setarQuadro(quadro);
    setIsOpen(false);
  };

  useEffect(() => {
    setQuadroSelecionado(null);
    props.setarQuadro(null);
    setIsOpen(false);
  }, []);

  return (
    <div className="relative w-full">
      <span className="text-white">Transferir</span>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-start"
      >
        {quadroSelecionado ? quadroSelecionado.nome : "Selecione um Quadro..."}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 w-full bg-gray-200 border border-gray-300 rounded mt-1 shadow-lg"
        >
          <ul className="max-h-60 overflow-auto">
            <li className="flex justify-between items-center p-2 hover:bg-gray-300">
              <div className="flex justify-between items-center w-full">
                <button
                  onClick={() => acaoSelecionarQuadro(null)}
                  className="text-black select-none w-full text-start"
                >
                  Selecione um Quadro...
                </button>
              </div>
            </li>
            {props.listaDeQuadros.length > 0 ? (
              props.listaDeQuadros.map((quadro) => (
                <li
                  key={quadro.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-300"
                >
                  <div className="flex justify-between items-center w-full">
                    <button
                      onClick={() => acaoSelecionarQuadro(quadro)}
                      className="text-black select-none w-full text-start"
                    >
                      {quadro.nome}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">
                Nenhum Quadro encontrado.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
