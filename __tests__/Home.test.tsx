import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page'

it("Teste da reenderização da pagina home", () => {
    render(<Home />)
})