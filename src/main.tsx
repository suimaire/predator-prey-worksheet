import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) throw new Error('학습지를 표시할 요소를 찾을 수 없습니다.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
