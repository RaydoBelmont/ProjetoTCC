export const inserirWorkspace = async (email: string, nome: string) => {
    try {
        const response = await fetch("/api/workspace", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: nome,
              email: email,
            }),
          });
  
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error("Ocorreu um erro ao criar a workspace:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Ocorreu um erro ao criar a workspace:", error);
      return null;
    }
  };
  