
type Props = {
  emailUser: string,
  idWorkspace: Number,
  workspaceName: string
};

const Workspace: React.FC<Props> = ({emailUser, idWorkspace,workspaceName}) => {

  return (
    <div>
      <h1>Bem vindo {emailUser}</h1>
      <h2>Workspace: {workspaceName}</h2>
    </div>
  )

}