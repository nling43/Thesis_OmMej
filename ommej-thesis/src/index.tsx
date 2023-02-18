import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Flow from './components/Flow_Test'
import NavBar from './components/NavBar';
import "./components/css/index.css"
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode >
    <div className='container-flex'>
    <NavBar />
    <Flow />
    </div>
    
    
  </React.StrictMode>
);
