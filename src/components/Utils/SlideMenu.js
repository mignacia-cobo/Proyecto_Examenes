import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import './SlideMenu.css';

const SlideMenu = ({ isExpanded, onToggleMenu }) => {
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);

  const toggleReportMenu = () => {
    setIsReportMenuOpen(!isReportMenuOpen);
  };

  return (
    <div className='slide-container'>
      <div className={`side-menu ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button onClick={onToggleMenu} className="toggle-menu-btn">
        <GiHamburgerMenu />
        </button>

      {isExpanded && (
        
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/Planificacion">Planificación de Exámenes</Link></li>
            <li><Link to="/Disponibilidad">Disponibilidad de Salas</Link></li>
            <li><Link to="/DisponibilidadSalas">Disponibilidad de Salas 2.0</Link></li>
            
            <div className="menu-item">
              <span onClick={toggleReportMenu}>GESTIÓN</span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Gestion/Salas">Salas</Link></li>
                  <li><Link to="/Gestion/Modulos">Modulos</Link></li>
                  <li><Link to="/GestionExamenes">Exámenes</Link></li>
                  <li><Link to="/Gestion/Alumnos">Alumnos</Link></li>
                  <li><Link to="/Gestion/CargaInicial">Carga Inicial</Link></li>
                </div>
              )}
            </div>
            <div className="menu-item">
              <span onClick={toggleReportMenu}>REPORTES</span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Reportes/ReportesAlumno" >Alumnos</Link></li>
                  <li><Link to="/Reportes/ReportesDocente">Docente</Link></li>
                </div>
              )}
            </div>
            
            {/* otros elementos del menú */}
          </ul>
        </nav>
        
      )}
    </div>
  
    </div>
  );
};

export default SlideMenu;