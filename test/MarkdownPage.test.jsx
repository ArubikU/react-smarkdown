import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { debug } from 'jest-preview';
import React from 'react';
import MarkdownPage from '../dist/markdown'; // Adjust this path if necessary


describe('App', () => {
  it('renders the MarkdownPage component with SimpleMarkdown', () => {
    render(<MarkdownPage />)
    
    // Preview the component
    debug()

    // Check if the SimpleMarkdown component is rendered
    const simpleMarkdown = screen.getByTestId('simple-markdown')
    expect(simpleMarkdown).toBeInTheDocument()

    // Check if the content is passed to SimpleMarkdown
    expect(simpleMarkdown).toHaveTextContent('Welcome to Our Markdown Page')
    expect(simpleMarkdown).toHaveTextContent('Features')
    expect(simpleMarkdown).toHaveTextContent('Admonitions')
    expect(simpleMarkdown).toHaveTextContent('Table')
  })

  it('applies correct classes to the container', () => {
    render(<MarkdownPage />)
    
    // Preview the component
    debug()

    const container = screen.getByTestId('simple-markdown').parentElement
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
  })
})