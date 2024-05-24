import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './panel.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
  
    <BrowserRouter>
      <Routes>
        
          <Route path="panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>)
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);