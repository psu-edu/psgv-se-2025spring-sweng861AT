import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const reactRoot = document.createElement('div');
  reactRoot.id = 'react-root';
  document.body.appendChild(reactRoot);

  ReactDOM.render(<App />, reactRoot);
});
