
type PropsSetor = {
    Setor: {
      id: number;
      nome: string;
    }[];
  }

export default function Setor (props: PropsSetor){
    return(
        <div className="bg-navy-900 min-h-screen text-white">
        <div className="container mx-auto p-4">
          <h1 className="text-teal-400 text-3xl font-bold mb-6">Listas da Workspace Softgran</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.Setor.map((setor, index) => (
              <div key={index} className="bg-[#212938] p-4 rounded-lg shadow-md">
                <h2 className="text-teal-300 text-xl font-semibold">{setor.nome}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}