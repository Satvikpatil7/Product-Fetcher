import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import './index.css';
import App from './App.tsx';
import { store } from './app/store'; // Import your Redux store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap App with Provider */}
      <App />
    </Provider>
  </StrictMode>,
);