import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import BotaoSetor from "../navbar/botões/Setores/setor";

type PropsSetor = {
  idWorkspace: number | null;
  nomeWorkspace: string | null;
  idUser: number | null;
  isAdmin: boolean | null;
  Setor: {
    id: number;
    nome: string;
  }[];
};

export default function Setor(props: PropsSetor) {
  const router = useRouter();
  const secretKey = String(process.env.CHAVE_CRIPTO);
  const data = {
    idWorkspace: props.idWorkspace,
    nomeWorkspace: props.nomeWorkspace,
    idUser: props.idUser,
    isAdmin: props.isAdmin,
  };

  const encryptedParams = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();

  const redirecionar = (setorId: number) => {
    const encryptedSetor = CryptoJS.AES.encrypt(
      String(setorId),
      secretKey
    ).toString();
    router.push(
      `/workspace/${encodeURIComponent(encryptedParams)}/${encodeURIComponent(
        encryptedSetor
      )}`
    );
  };

  return (
    <div className="bg-navy-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-teal-300 text-3xl font-bold mb-6 text-center">
          Setores de {props.nomeWorkspace}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BotaoSetor
            idWorkspace={props.idWorkspace}
            userId={props.idUser}
            usoTela={true}
          ></BotaoSetor>
          {props.Setor.map((setor, index) => (
            <button
              key={index}
              value={setor.id}
              className="bg-[#212938] p-4 rounded-lg shadow-md text-teal-300 text-xl font-semibold"
              onClick={() => redirecionar(setor.id)}
            >
              {setor.nome}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
