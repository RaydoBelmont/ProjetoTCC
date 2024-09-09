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

const Setor: React.FC = () => {
  const { idWorkspace, idSetor } = useParams();

  return (
    <main>
      <div className="w-full flex flex-col items-center">
        <NavbarSetor
          idSetor={Number(idSetor)}
          idWorkspace={Number(idWorkspace)}
        />
        <div className="flex flex-col w-full p-2 gap-8">
          <Typography variant="h3">Quadros da Softgran</Typography>
          <div className="flex flex-wrap gap-4 p-4">
            {/* Lista 1 */}
            <Card className="w-72 bg-[#202938]">
              <CardHeader  className="bg-[#38bdf8] relative">
                <h3 className="text-white text-lg px-2 py-1 text-center">Lista 1</h3>
              </CardHeader>
              <div className="flex flex-col justify-between">
                <CardBody className="flex flex-col space-y-2 pb-4">
                  <Button variant="text" className="bg-[#394152] text-white p-2 rounded-lg">
                    Chamado 1
                  </Button>
                  <Button variant="text" className="bg-[#394152] text-white p-2 rounded-lg">
                    Chamado 2
                  </Button>
                  <Button variant="text" className="bg-[#394152] text-white p-2 rounded-lg">
                    Chamado 3
                  </Button>
                  <Button variant="text" className="bg-[#394152] text-white p-2 rounded-lg">
                    Chamado 4
                  </Button>
                </CardBody>
                <CardFooter className="p-4 px-6">
                  <Button color="green" fullWidth>
                    Adicionar Chamado
                  </Button>
                </CardFooter>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Setor;
