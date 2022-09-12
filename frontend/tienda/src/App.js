import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navegacion } from './components/Navegacion';
import { ModuloAdmin } from './components/ModuloAdmin';
import { Tienda } from './components/Tienda';


function App() {
  return (
    <Router>
      <Navegacion/>
      <Routes>
        <Route path='/' exact element = {App}/>
        <Route path='/tienda' exact element = {<Tienda/>} />
        <Route path='/admin' exact element = {<ModuloAdmin/>}/>
      </Routes>          
    </Router>
    
  );
}

export default App;
