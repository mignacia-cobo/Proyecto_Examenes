import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import './PlaExamen.css';
import { FaArrowCircleRight,FaCircle } from "react-icons/fa";
import { fetchReservas, crearReserva, fetchSalasConfirmadas, fetchExamenes, fetchModulos } from '../../services/api';

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

  const obtenerFechasDeLaSemana = (fechaBase) => {
    const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: inicioSemana, end: addDays(inicioSemana, 5) })
      .map(dia => ({
        dia: format(dia, 'EEEE', { locale: es }), // Nombres de los días en español
        fecha: format(dia, 'yyyy-MM-dd'),
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
      {fechasDeLaSemana.map(({ dia, fecha }) => (
        <th key={fecha}>{dia} <br /> {fecha}</th>
      ))}
    </tr>
  );

  const renderFilasTabla = () => (
    <>
      {modulos.map((modulo) => (
        <tr key={modulo.ID_Modulo}>
          <td>{modulo.Numero}</td>
          <td>{`${modulo.Hora_inicio} - ${modulo.Hora_final}`}</td>
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
              <td key={`${fecha}-${modulo.ID_Modulo}`}>
                {reservaExistente ? (
                  <div className="reserva-detalles">
                    <p>Examen: {reservaExistente.Examen?.Nombre_Examen}</p>
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
          <div className='search-box' style={{maxHeight:'35%'}}>
            <div className="search-box-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {salas.map((sala) => (
                    <tr key={sala.ID_Sala}>
                      <td>{sala.ID_Sala}</td>
                      <td>{sala.Nombre_sala}</td>
                      <td>{sala.Codigo_sala}</td>
                      <td>
                        <button 
                        onClick={() => setSelectedSala(sala)}>Seleccionar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <h2>Seleccionar Examen</h2>
          <div className='search-box' style={{maxHeight:'35%'}}>
            <div className="search-box-table">
              <table>
                <thead>
                  <tr>
                    <th>ID Examen</th>
                    <th>Nombre del Examen</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {examenes.map((examen) => (
                    <tr key={examen.ID_Examen}>
                      <td>{examen.ID_Examen}</td>
                      <td>{examen.Nombre_Examen}</td>
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
            </div>
          </div>
        </div>
      </div>
      <div className='details-section'>
        {selectedSala && (
        <div className='details-section-table'>
          <div className='details-section-content'>
            <h3 style={{textAlign:'center'}}>Horario de la sala
            <br/>{selectedSala?.Codigo_sala} - {selectedSala?.Nombre_sala}
            </h3>
          </div>
          <table>
            <thead>{renderCabeceraTabla()}</thead>
            <tbody>{renderFilasTabla()}</tbody>
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
