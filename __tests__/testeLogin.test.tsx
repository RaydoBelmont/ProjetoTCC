import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page"; // ajuste o caminho conforme necessário
import type { ReactElement } from "react";
import { signIn } from "next-auth/react";

import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
jest.mock("next-auth/react"); // Mock da biblioteca de autenticação

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("deve chamar a função de login ao clicar no botão", async () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", {
      name: "Fazer login com Google",
    });
    fireEvent.click(loginButton);

    expect(signIn).toHaveBeenCalledWith("google"); // Verifica se a função de login foi chamada com o provedor correto
  });

  it("deve desabilitar o botão enquanto está carregando", async () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", {
      name: "Fazer login com Google",
    });

    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled(); // Verifica se o botão é desabilitado durante o login
    expect(loginButton).toHaveTextContent("Loading..."); // Verifica se o texto do botão muda para "Loading..."
  });
});
