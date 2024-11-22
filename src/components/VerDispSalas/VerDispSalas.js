import React, { useState, useEffect } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';
import './VerDispSalas.css';

function VerDisponibilidadSalas() {
  const [salas, setSalas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [edificioFiltro, setEdificioFiltro] = useState('');
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [codigoSalaFiltro, setCodigoSalaFiltro] = useState('');
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [salasFiltradas, setSalasFiltradas] = useState([]); // Estado para los resultados de búsqueda

  const obtenerFechasDeLaSemana = (fechaBase) => {
    let fechas = {};
    const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 });
    for (let i = 0; i < 6; i++) {
      const fechaDia = addDays(inicioSemana, i);
      const nombreDia = format(fechaDia, 'EEEE');
      fechas[nombreDia] = format(fechaDia, 'dd/MM/yyyy');
    }
    return fechas;
  };

  const fechasDeLaSemana = obtenerFechasDeLaSemana(fechaSeleccionada);

  const rangosHorarios = [
    '08:01 - 08:40', '08:41 - 09:20', '09:31 - 10:10', '10:11 - 10:50',
    '11:01 - 11:40', '11:41 - 12:20', '12:31 - 13:10', '13:11 - 13:50',
    '14:01 - 14:40', '14:41 - 15:20', '15:31 - 16:10', '16:11 - 16:50',
    '17:01 - 17:40', '17:41 - 18:20', '18:21 - 19:00', '19:11 - 19:50',
    '19:51 - 20:30', '20:41 - 21:20', '21:21 - 22:00', '22:10 - 22:50'
  ];

  useEffect(() => {
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      setSalas(JSON.parse(salasGuardadas));
      setSalasFiltradas(JSON.parse(salasGuardadas)); // Cargar todas las salas por defecto
    }
  }, []);

  const renderCabeceraTabla = () => {
    return (
      <tr>
        <th colSpan="2">Módulo</th>
        {Object.entries(fechasDeLaSemana).map(([dia, fecha]) => (
          <th key={dia}>{`${dia}`} <br /> {`${fecha}`}</th>
        ))}
      </tr>
    );
  };

  const filtrarSalas = () => {
    console.log("Salas disponibles:", salas);

    const lowerCaseNombreFiltro = nombreFiltro.toLowerCase();
    const lowerCaseCodigoSalaFiltro = codigoSalaFiltro.toLowerCase();
    const lowerCaseEdificioFiltro = edificioFiltro.toLowerCase();
  
    const salasFiltradas = salas.filter(sala =>
      (codigoSalaFiltro ? sala.codigo.toLowerCase().includes(lowerCaseCodigoSalaFiltro) : true) &&
      (nombreFiltro ? sala.nombre.toLowerCase().includes(lowerCaseNombreFiltro) : true) &&
      (edificioFiltro ? sala.edificio.toLowerCase().includes(lowerCaseEdificioFiltro) : true)
    );
  
    setSalasFiltradas(salasFiltradas);
  };

  const renderFilasTabla = () => {
    if (!salaSeleccionada || !salaSeleccionada.dias) {
      return <tr><td colSpan="8">No hay sala seleccionada o datos disponibles</td></tr>;
    }

    const diasDeLaSemana = Object.keys(salaSeleccionada.dias);

    return (
      <>
      <p className="titulo-disp-salas">Disponibilidad de Salas</p>
        {rangosHorarios.map((horario, indexModulo) => (
          <tr key={indexModulo}>
            <td>{indexModulo + 1}</td>
            <td className='colHorario'>{horario}</td>
            {diasDeLaSemana.map(dia => {
              const modulo = salaSeleccionada.dias[dia][indexModulo] || {};

              return (
                <td key={`${dia}-${indexModulo}`}>
                  {modulo.estado === 'reservado' ? (
                    <div>
                      <span><strong>Evento:</strong> {modulo.evento || 'N/A'}</span><br />
                      <span><strong>Sección:</strong> {modulo.seccion || 'N/A'}</span><br />
                      <span><strong>Asignatura:</strong> {modulo.asignatura || 'N/A'}</span><br />
                      <span><strong>Docente:</strong> {modulo.docente || 'N/A'}</span><br />
                    </div>
                  ) : (
                    <div>
                      <span>Disponible</span>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  };

  const handleSelectSala = (sala) => {
    setSalaSeleccionada(sala);
  };

  return (
    <>
      <p className="titulo">Disponibilidad de Salas</p>
      <div className='container-lateral'>
        <div className="search-section">
          <h2>Seleccionar Sala</h2>
          <div className="search-box">
            <input 
              type="date" 
              value={format(fechaSeleccionada, 'yyyy-MM-dd')} 
              onChange={(e) => setFechaSeleccionada(new Date(e.target.value))} 
            />
            <input
              type="text"
              placeholder="Edificio"
              value={edificioFiltro}
              onChange={(e) => setEdificioFiltro(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nombreFiltro}
              onChange={(e) => setNombreFiltro(e.target.value)}
            />
            <input
              type="text"
              placeholder="cod. Sala"
              value={codigoSalaFiltro}
              onChange={(e) => setCodigoSalaFiltro(e.target.value)}
            />
            <button onClick={filtrarSalas}>Buscar</button> {/* Botón de búsqueda */}
            <div className="search-box-table">
              <table>
                <thead>
                  <tr>
                    <th>cod. Sala</th>
                    <th>Nombre</th>
                    <th>Edificio</th>
                    <th>  </th>
                  </tr>
                </thead>
                <tbody>
                  {salasFiltradas.map((sala, index) => (
                    <tr key={index}>
                      <td>{sala.codigo}</td>
                      <td>{sala.nombre}</td>
                      <td>{sala.edificio}</td>
                      <td>
                        <button 
                          onClick={() => handleSelectSala(sala)} 
                          className={`imagenb ${salaSeleccionada === sala ? 'imagen-seleccionada' : ''}`}>
                          <img className="imagen-boton" src="sel.png" alt="Seleccionar" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>  
        </div>
      </div>
        
      <div className="details-section" style={{ marginTop: '3px' }}>
        {salaSeleccionada && (
          <table>
            <thead>
              <tr>
                <th colSpan={8}>{`Sala ${salaSeleccionada.codigo} - ${salaSeleccionada.nombre} (${salaSeleccionada.capacidad}) - ${salaSeleccionada.edificio}`}</th>
              </tr>
              {renderCabeceraTabla()}
            </thead>
            <tbody>
              {renderFilasTabla()}
            </tbody>
          </table>
        )}
      </div> 
    </>
  );
}

export default VerDisponibilidadSalas;
