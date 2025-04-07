import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SlideMenu from './components/Utils/SlideMenu';
import Home from './components/Home/Home';
//import DispSalas from './components/DispSalas/DispSalas';
import VerDispSalas from './components/VerDispSalas/VerDispSalas';
import GesSalas from './components/Gestion/GesSalas/GesSalas';
import PlaExamen from './components/PlaExamen/PlaExamen';
import GesExamen from './components/Gestion/GesExamen/GesExamen';
import Login from './components/Login/Login';
import ReportesDocente from './components/Reportes/ReportesDocente/ReportesDocente';
import GesAlumnos from './components/Gestion/GesAlumnos/GesAlumnos';
import GesDocentes from './components/Gestion/GesDocentes/GesDocentes';
//import ReportesAlumno from './components/Reportes/ReportesAlumno/ReportesAlumno';
import EditarSala from './components/Gestion/GesSalas/EditarSala';
import GesModulos from './components/Gestion/GesModulos/GesModulos';
import EditarModulo from './components/Gestion/GesModulos/EditarModulo';
import GesInicial from './components/Gestion/GesInicial/GesInicial';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };


  return (
    <Router>
      <header className="app-header">
         <img src="/logo.png" alt="Logo" />
         <div className="app-header-text">
          <h1>Planificación y Comunicación de Exámenes</h1>
        </div>
      </header> 

      {isAuthenticated ? (
        <>
          <div className={`main-container ${isMenuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
            <SlideMenu isExpanded={isMenuExpanded} onToggleMenu={toggleMenu} />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Planificacion" element={<PlaExamen />} />
                {/*<Route path="/Disponibilidad" element={<DispSalas />} />*/}
                <Route path="/DisponibilidadSalas" element={<VerDispSalas />} />
                <Route path='/Gestion/Salas' element={<GesSalas />} />
                <Route path="/EditarSala/:id" element={<EditarSala />} /> {/* Nueva ruta para editar sala */}
                <Route path='/Gestion/Modulos' element={<GesModulos />} />
                <Route path="/EditarModulo/:id" element={<EditarModulo />} /> {/* Nueva ruta para editar sala */}
                <Route path="/GestionExamenes" element={<GesExamen />} />
                <Route path="/Gestion/Alumnos" element={<GesAlumnos />} />
                <Route path="/Gestion/Docentes" element={<GesDocentes />} />
                <Route path="/Gestion/CargaInicial" element={<GesInicial />} />
                 {/*<Route path="/Gestion/Usuarios" element={<GesUser />} /> */}
                <Route path="/Reportes/ReportesDocente" element={<ReportesDocente/>} />
                {/*<Route path="/Reportes/ReportesAlumno" element={<ReportesAlumno/>} />*/}
                
                
                {/* Agrega otras rutas */}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;