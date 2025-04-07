import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { RiSettings5Fill,RiToolsFill,RiStackOverflowFill,RiFolderOpenFill} from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
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
            <li><Link to="/"><LiaHomeSolid/><span>Inicio</span></Link></li>
            <li><Link to="/Planificacion"><LuCalendarClock/><span>Planificación</span></Link></li>
      {/*<li><Link to="/Disponibilidad"><PiCalendarCheckBold/><a>NODisponibilidad SalasNO</a></Link></li>*/}
            <li><Link to="/DisponibilidadSalas"><LuCalendarSearch/><span>Disponibilidad Salas</span></Link></li>
            
            <div className="menu-item">
              <span className="menu" onClick={toggleReportMenu}><RiSettings5Fill />GESTIÓN</span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Gestion/Salas"><FaUniversity/><span>Salas</span></Link></li>
                  <li><Link to="/Gestion/Modulos"><BsBoxes /><span>Modulos</span></Link></li>
                  <li><Link to="/GestionExamenes"><RiStackOverflowFill /><span>Exámenes</span></Link></li>
                  <li><Link to="/Gestion/Alumnos"><PiStudentFill /><span>Alumnos</span></Link></li>
                  <li><Link to="/Gestion/Docentes"><FaChalkboardTeacher/><span>Docentes</span></Link></li>
                  <li><Link to="/Gestion/CargaInicial"><RiToolsFill /><span>Carga Inicial</span></Link></li>
                </div>
              )}
            </div>
            <div className="menu-item">
              <span className="menu" onClick={toggleReportMenu}><RiFolderOpenFill /><span>REPORTES</span></span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Reportes/ReportesAlumno" ><PiStudentFill /><span>Alumnos</span></Link></li>
                  <li><Link to="/Reportes/ReportesDocente"><FaChalkboardTeacher/><span>Docente</span></Link></li>
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