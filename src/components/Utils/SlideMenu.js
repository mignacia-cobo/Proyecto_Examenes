import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { RiSettings5Fill,RiToolsFill,RiStackOverflowFill,RiFolderOpenFill} from "react-icons/ri";
import { PiStudentFill,PiCalendarCheckBold } from "react-icons/pi";
import { BsBoxes } from "react-icons/bs";
import { FaUniversity } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LuCalendarSearch, LuCalendarClock } from "react-icons/lu";
import { LiaHomeSolid } from "react-icons/lia";
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
            <li><Link to="/"><LiaHomeSolid/><a>Inicio</a></Link></li>
            <li><Link to="/Planificacion"><LuCalendarClock/><a>Planificación</a></Link></li>
      {/*<li><Link to="/Disponibilidad"><PiCalendarCheckBold/><a>NODisponibilidad SalasNO</a></Link></li>*/}
            <li><Link to="/DisponibilidadSalas"><LuCalendarSearch/><a>Disponibilidad Salas</a></Link></li>
            
            <div className="menu-item">
              <span className="menu" onClick={toggleReportMenu}><RiSettings5Fill /><a>GESTIÓN</a></span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Gestion/Salas"><FaUniversity/><a>Salas</a></Link></li>
                  <li><Link to="/Gestion/Modulos"><BsBoxes /><a>Modulos</a></Link></li>
                  <li><Link to="/GestionExamenes"><RiStackOverflowFill /><a>Exámenes</a></Link></li>
                  <li><Link to="/Gestion/Alumnos"><PiStudentFill /><a>Alumnos</a></Link></li>
                  <li><Link to="/Gestion/Docentes"><FaChalkboardTeacher/><a>Docentes</a></Link></li>
                  <li><Link to="/Gestion/CargaInicial"><RiToolsFill /><a>Carga Inicial</a></Link></li>
                </div>
              )}
            </div>
            <div className="menu-item">
              <span className="menu" onClick={toggleReportMenu}><RiFolderOpenFill /><a>REPORTES</a></span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Reportes/ReportesAlumno" ><PiStudentFill /><a>Alumnos</a></Link></li>
                  <li><Link to="/Reportes/ReportesDocente"><FaChalkboardTeacher/><a>Docente</a></Link></li>
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