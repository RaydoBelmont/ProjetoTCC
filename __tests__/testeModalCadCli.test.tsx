import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalCadCli from '../src/app/components/modals/modalCadCli';

it("Teste para modal", () => {
    render(<ModalCadCli />);
    const openButton = screen.getByText('Abrir Modal');
    fireEvent.click(openButton);

    const modalContent = screen.getByText('Conteúdo do Modal');
    expect(modalContent).toBeInTheDocument();
    
    const closeButton = screen.getByText('Fechar Modal');
    fireEvent.click(closeButton);

    expect(modalContent).not.toBeInTheDocument();
});
