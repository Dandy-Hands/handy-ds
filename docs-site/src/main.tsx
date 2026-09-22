import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { buildTheme } from '../../src/tokens/index.ts';
import { App } from './App.tsx';
import './index.css';

const { css } = buildTheme();
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
