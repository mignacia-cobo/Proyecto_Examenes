import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import './PlaExamen.css';
import { FaArrowCircleRight,FaCircle } from "react-icons/fa";
import { fetchReservas, crearReserva, fetchSalasConfirmadas, fetchExamenes, fetchModulos,actualizarEstadoSala } from '../../services/api';

function PlaExamen() {
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [selectedSala, setSelectedSala] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [modulosSeleccionados, setModulosSeleccionados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [examenSeleccionado, setExamenSeleccionado] = useState(null); // Examen actualmente seleccionado
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermExamen, setSearchTermExamen] = useState ('');

  const obtenerFechasDeLaSemana = (fechaBase) => {
    const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: inicioSemana, end: addDays(inicioSemana, 5) })
      .map(dia => ({
        dia: format(dia, 'EEEE', { locale: es }), // Nombres de los días en español
        fecha: format(dia, 'yyyy-MM-dd'),
        fechaMostrar: format(dia, 'dd/MM/yyyy'),
      }));
  };
  const fechasDeLaSemana = obtenerFechasDeLaSemana(fechaSeleccionada);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const salasData = await fetchSalasConfirmadas();
        const examenesData = await fetchExamenes();
        const modulosData = await fetchModulos();
        const reservasData = await fetchReservas();
        console.log('Datos cargados:', salasData, examenesData, modulosData, reservasData);
        setSalas(salasData);
        setExamenes(examenesData);
        setModulos(modulosData);
        setReservas(reservasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

  //BUESQUEDA DE SALAS
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  //BUESQUEDA DE EXAMENES
  const handleSearchExamen = (e) => {
    setSearchTermExamen(e.target.value);
  };
  
  //FILTRAR SALAS
  const filteredSalas = salas?.filter(sala =>
    sala.Codigo_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.Nombre_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.Capacidad.toString().includes(searchTerm) ||
    sala.Edificio?.Nombre_Edificio.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );
  //FILTRAR EXAMENES
  const filteredExamenes = examenes?.filter(examen =>
    examen.Seccion?.Nombre_Seccion.toLowerCase().includes(searchTermExamen.toLowerCase()) ||
    examen.Asignatura?.Nombre_Asignatura.toLowerCase().includes(searchTermExamen.toLowerCase()),
  );

  //MANEJAR SELECCION DE EXAMEN
  const manejarSeleccionExamen = (examen) => {
    if (examenSeleccionado?.ID_Examen === examen.ID_Examen) {
      console.log("Deseleccionado:", examen);
      setExamenSeleccionado(null);
      setSelectedExam(null);
    } else {
      console.log("Seleccionado:", examen);
      setExamenSeleccionado(examen);
      setSelectedExam(examen);
    }
  };

  //MANEJAR LA SELECCION DE SALA
  const manejarSeleccionSala = async (sala) => {
    try {
      // Si ya hay una sala seleccionada, cambiar su estado a "disponible" (por ejemplo, ID_Estado = 1)
      if (selectedSala) {
        await actualizarEstadoSala(selectedSala.ID_Sala, 1); // Cambiar estado de la sala previa
      }
  
      // Cambiar el estado de la nueva sala a "ocupada" (por ejemplo, ID_Estado = 2)
      await actualizarEstadoSala(sala.ID_Sala, 2);
  
      // Actualizar el estado local para reflejar los cambios
      setSalas((prevSalas) =>
        prevSalas.map((s) =>
          s.ID_Sala === sala.ID_Sala
            ? { ...s, ID_Estado: 2 } // Nueva sala seleccionada
            : s.ID_Sala === selectedSala?.ID_Sala
            ? { ...s, ID_Estado: 1 } // Sala previa vuelve a estar disponible
            : s
        )
      );
  
      // Actualizar el estado de la sala seleccionada
      setSelectedSala(sala);
  
      console.log(`Sala seleccionada: ${sala.Nombre_sala}`);
    } catch (error) {
      console.error('Error al manejar la selección de la sala:', error);
      alert('Hubo un error al actualizar el estado de la sala');
    }
  };

  const crearEstructuraReserva = () => {
    if (!selectedSala || !selectedExam || modulosSeleccionados.length === 0) {
      alert('Por favor, selecciona una sala, un examen y al menos un módulo.');
      return null;
    }

    return {
      Fecha: modulosSeleccionados[0]?.fecha,
      ID_Sala: selectedSala.ID_Sala,
      ID_Examen: selectedExam.ID_Examen,
      Modulos: modulosSeleccionados.map((modulo) => {
        const detalleModulo = modulos.find((m) => m.Numero === modulo.numero);
        return {
          ID_Modulo: detalleModulo?.ID_Modulo,
        };
      }),
    };
  };

  
  const enviarReserva = async () => {
    const estructuraReserva = crearEstructuraReserva();
    console.log('Estructura de la reserva:', estructuraReserva);
    if (!estructuraReserva) return;
    
    try {
      const response = await crearReserva(estructuraReserva);
  
      // Cambiar el estado del examen a 3
      setExamenes((prevExamenes) =>
        prevExamenes.map((examen) =>
          examen.ID_Examen === estructuraReserva.ID_Examen
            ? { ...examen, ID_Estado: 3 }
            : examen
        )
      );
      
      // Agregar la nueva reserva al estado con los datos confirmados desde el backend
      const nuevaReserva = response.data; // Asume que el backend devuelve la reserva recién creada
      setReservas((prevReservas) => [...prevReservas, nuevaReserva]);
  
      console.log('Reserva creada con éxito:', nuevaReserva);
      alert('Reserva creada con éxito');
  
      // Opcional: Si fetchReservas es necesario para recargar todas las reservas
      const nuevasReservas = await fetchReservas();
      console.log('Reservas actualizadas Nuevas:', nuevasReservas);
      setReservas(nuevasReservas);
  
      setModulosSeleccionados([]); // Reinicia la selección
    
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      alert('Error al crear la reserva');
    }
  };

  const seleccionarModulo = (fecha, numeroModulo) => {
    console.log('Seleccionando módulo:', fecha, numeroModulo);

    setModulosSeleccionados((prev) => {
      if (prev.length === 0) {
        return [{ fecha, numero: numeroModulo }];
      }

      const fechaSeleccionada = prev[0].fecha;
      if (fecha !== fechaSeleccionada) {
        alert('Solo puedes seleccionar módulos del mismo día.');
        return prev;
      }

      const index = prev.findIndex((modulo) => modulo.numero === numeroModulo);
      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }

      return [...prev, { fecha, numero: numeroModulo }];
    });
  };

  const renderCabeceraTabla = () => (
    <tr>
      <th colSpan="2">Módulo</th>
      {fechasDeLaSemana.map(({ dia, fechaMostrar }) => (
      <th key={fechaMostrar}>{dia} <br /> {fechaMostrar}</th>
      ))}
    </tr>
  );

  const renderFilasTabla = () => (
    <>
      {modulos.map((modulo) => (
        <tr key={modulo.ID_Modulo}>
          <td className="numero-modulo">{modulo.Numero}</td>
          <td className="horario-modulo">
            {format(new Date(`1970-01-01T${modulo.Hora_inicio}`), 'HH:mm')}
            <br />
            {format(new Date(`1970-01-01T${modulo.Hora_final}`), 'HH:mm')}
          </td>
          {fechasDeLaSemana.map(({ fecha }) => {
            // Encontrar reserva existente
            const reservaExistente = reservas.find(
              (reserva) =>
                reserva?.ID_Sala === selectedSala?.ID_Sala &&
                reserva?.Fecha === fecha &&
                reserva?.Modulos.some((m) => m.ID_Modulo === modulo.ID_Modulo)
            );

            const estaSeleccionado = modulosSeleccionados.some(
              (moduloSel) => moduloSel.fecha === fecha && moduloSel.numero === modulo.Numero
            );

            return (
              <td key={`${fecha}-${modulo.ID_Modulo}`}
                className={reservaExistente ? 'reservado':'disponible'}>
                  {reservaExistente? (
                  <div>
                    <span className='detalle'>{reservaExistente.Examen?.Nombre_Examen||'N/A'}</span>
                    <span className='info-reserva'>{reservaExistente.Examen?.Seccion?.Nombre_Seccion || 'N/A'}</span>
                    <span className='info-reserva'>MÓDULOS: {reservaExistente.Examen?.Cantidad_Modulos || 'N/A'}</span>
                    <span className='info-reserva'>DOCENTE: {reservaExistente.Examen?.Seccion?.Usuarios?.find(
                    (usuario) => usuario)?.Nombre || 'N/A'}</span>
                  </div>
                ) : (
                  <button
                    className={estaSeleccionado ? 'boton-modulo-seleccionado' : ''}
                    onClick={() => seleccionarModulo(fecha, modulo.Numero)}
                  >
                    Seleccionar
                  </button>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );

  return (
    <>
      <p className='titulo'>Planificación de Exámenes</p>
      <div className='container-lateral'>
        <div className="search-section">
          <h2>Seleccionar Fecha</h2>
          <div className="search-box">
            <input
              type="date"
              value={format(fechaSeleccionada, 'yyyy-MM-dd')}
              onChange={(e) => setFechaSeleccionada(new Date(e.target.value))}
            />
          </div>
          <h2>Seleccionar Sala</h2>
          <div className="search-box">
            <input
              type='search'
              placeholder='Buscar...'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className='search-box' style={{maxHeight:'34%'}}>
            <div className="search-box-table">
              {filteredSalas.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Cód.</th>
                    <th>Nombre</th>
                    <th>Edificio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {filteredSalas.filter((sala) => sala.ID_Estado === 1 || sala.ID_Estado ===2) // Usar estado dinámico
                      .map((sala) => (
                    <tr
                      key={sala.ID_Sala}
                      className={selectedSala?.ID_Sala === sala.ID_Sala ? 'fila-seleccionada' : ''}
                    >
                      <td>{sala.Codigo_sala}</td>
                      <td>{sala.Nombre_sala}</td>
                      <td>{sala.Edificio?.Nombre_Edificio}</td>
                      <td>
                        <FaArrowCircleRight
                          className={`icono ${selectedSala?.ID_Sala === sala.ID_Sala ? 'seleccionado' : ''}`} 
                          onClick={() => manejarSeleccionSala(sala)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
          <h2>Seleccionar Examen</h2>
          <div className="search-box">
            <input
            type='search'
            placeholder='Buscar...'
            value={searchTermExamen}
            onChange={handleSearchExamen}
            />
          </div>
          <div className='search-box' style={{maxHeight:'34%'}}>
            <div className="search-box-table">
              {filteredExamenes.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Sección</th>
                    <th>Asignatura</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExamenes.map((examen) => (
                    <tr key={examen.ID_Examen}>
                      <td>{examen.Seccion?.Nombre_Seccion}</td>
                      <td>{examen.Asignatura?.Nombre_Asignatura}</td>
                      <td>
                        {examen.ID_Estado === 3 ? (
                          <FaCircle className="icono-reserv" />
                        ) : examen.ID_Estado === 4 && (
                          <FaArrowCircleRight
                            className={`icono ${examenSeleccionado?.ID_Examen === examen.ID_Examen ? 'seleccionado' : ''}`}                            cursor={'pointer'}
                            onClick={() => manejarSeleccionExamen(examen)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='details-section'>
        {selectedSala && (
        <div className='details-section-table'>
          <table>
            <thead>
              <tr>
                <th colSpan={8}>
                  <h2>Sala {selectedSala?.Nombre_sala}</h2>
                </th>
              </tr>
              {renderCabeceraTabla()}
            </thead>
            <tbody>
              {renderFilasTabla()}
            </tbody>
          </table>
          <div className='details-section-content'>
            <button onClick={enviarReserva}>Confirmar Reserva</button>
          </div>
        </div>
        )}
      </div>
    </>
  );
}

export default PlaExamen;
