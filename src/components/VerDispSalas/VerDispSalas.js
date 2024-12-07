import React, { useState, useEffect } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';
import './VerDispSalas.css';
import { es } from 'date-fns/locale';
import { FaArrowCircleRight } from "react-icons/fa";
import { fetchModulos, fetchReservasPorSala,fetchSalasConfirmadas } from '../../services/api';

function VerDisponibilidadSalas() {
  const [salas, setSalas] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [edificioFiltro, setEdificioFiltro] = useState('');
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [codigoSalaFiltro, setCodigoSalaFiltro] = useState('');
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [salasFiltradas, setSalasFiltradas] = useState([]); // Estado para los resultados de búsqueda

//FUNCION PARA OBTENER LAS SALAS DE LA BASE DE DATOS
  useEffect(() => {
    const cargarDatos= async () => {
      try {
        const salasData = await fetchSalasConfirmadas();
        const modulosData = await fetchModulos();
        const reservasData = await fetchReservasPorSala();
        setSalas(salasData);
        setModulos(modulosData);
        setReservas(reservasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  //FUNCIÓN PARA FILTRA LAS SALAS SEGÚN LOS CRITERIOS DE BÚSQUEDA
  const filtrarSalas = () => {
    const lowerCaseNombreFiltro = nombreFiltro.toLowerCase();
    const lowerCaseCodigoSalaFiltro = codigoSalaFiltro.toLowerCase();
    const lowerCaseEdificioFiltro = edificioFiltro.toLowerCase();
  
    const salasFiltradas = salas.filter(sala =>
      (codigoSalaFiltro ? sala.Codigo_sala.toLowerCase().includes(lowerCaseCodigoSalaFiltro) : true) &&
      (nombreFiltro ? sala.Nombre_sala.toLowerCase().includes(lowerCaseNombreFiltro) : true) &&
      (edificioFiltro ? sala.Edificio?.Nombre_Edificio.toLowerCase().includes(lowerCaseEdificioFiltro) : true)
    );
    setSalasFiltradas(salasFiltradas);
  };
  

  const obtenerFechasDeLaSemana = (fechaBase) => {
    const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 });
    return Array.from({ length: 6 }, (_, i) => addDays(inicioSemana, i)).map((fecha) =>({
      dia: format(fecha, 'EEEE', { locale: es }),
      fecha: format(fecha, 'dd/MM/yyyy'), // Formato de fecha para mostrar en la tabla
      fechaComparacion: format(fecha, 'yyyy-MM-dd'), // Formato de fecha para comparar con las reservas
    }));
  };

  const fechasDeLaSemana = obtenerFechasDeLaSemana(fechaSeleccionada);

  const renderCabeceraTabla = () => {
    return(
      <tr>
        <th colSpan="2">Módulo</th>
        {fechasDeLaSemana.map(({dia, fecha}) => (
          <th key={fecha}>{dia}<br/>{fecha}</th>
        ))}
      </tr>
    );
  };

  const renderFilasTabla = () => {
    if (!salaSeleccionada || !modulos || !reservas) {
      return <tr><td colSpan="8">No hay datos disponibles...</td></tr>;
    }
    return modulos.map((modulo) => (        
      <tr key={modulo.Numero}>
        <td className="numero-modulo">{modulo.Numero}</td>
        <td className="horario-modulo">
          {format(new Date(`1970-01-01T${modulo.Hora_inicio}`), 'HH:mm')}
          <br />
          {format(new Date(`1970-01-01T${modulo.Hora_final}`), 'HH:mm')}
        </td>
        {fechasDeLaSemana.map(({fecha,fechaComparacion}) => {          
          const moduloReservado = salaSeleccionada.dias[fechaComparacion]?.[modulo.Numero - 1];
           
          return (
            <td key={`${fechaComparacion}-${modulo.Numero}`}
            className={moduloReservado? 'reservado':'disponible'}>
              {moduloReservado ? (
                <div>
                  <span className='detalle'>{moduloReservado.evento}</span>
                  <span className='info-reserva'>{moduloReservado.seccion}</span>
                  <span className='info-reserva'>MÓDULOS: {moduloReservado.cantModulos}</span>
                  <span className='info-reserva'>DOCENTE: {moduloReservado.docente}</span>
                </div>
              ) : (
                <span>Disponible</span>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };


  const handleSelectSala = async (sala) => {
    try {
      // Llamada a la API para obtener las reservas de la sala seleccionada
      const reservas = await fetchReservasPorSala(sala.ID_Sala);
      console.log(reservas);

      // Estructura las reservas por día y módulo
      const diasReservados = {};
  
      reservas.forEach((reserva) => {
        reserva.Modulos.forEach((modulo) => {
            const fecha = reserva.Fecha; // Fecha de la reserva

            // Inicializar el día si no existe
            if (!diasReservados[fecha]) {
              diasReservados[fecha] = [];
            }
            // Buscar el docente de la sección
            const docente = reserva.Examen?.Seccion?.Usuarios?.find(
              (usuario) => usuario)?.Nombre || 'N/A';
            
            // Guardar la reserva en el día y módulo correspondiente
            diasReservados[fecha][modulo.Numero - 1] = {
              estado: 'reservado',
              evento: reserva.Examen?.Nombre_Examen || 'N/A',
              seccion: reserva.Examen?.Seccion?.Nombre_Seccion || 'N/A',
              cantModulos: reserva.Examen?.Cantidad_Modulos || 'N/A',
              docente: docente,
            };
        });
      });
      console.log('diasReservados',diasReservados, 'Reservas',reservas);
      setSalaSeleccionada({
        ...sala,
        dias: diasReservados,
      });
    } catch (error) {
      console.error('Error al cargar las reservas de la sala:', error);
      alert('No se pudieron cargar las reservas de la sala seleccionada.');
    }
  };
  

  return (
    <>
      <p className="titulo">Disponibilidad de Salas</p>
      <div className='container-lateral'>
        <div className="search-section">
          <h2>Seleccionar Sala</h2>
          <div className="search-box" style={{maxHeight:'45%'}}>
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
          </div>
          <div className='search-box' style={{maxHeight:'73%'}}>
            <div className='search-box-table'>
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
                  {salasFiltradas.map((sala, index) => (
                    <tr key={index}>
                      <td>{sala.Codigo_sala}</td>
                      <td>{sala.Nombre_sala}</td>
                      <td>{sala.Edificio.Nombre_Edificio}</td>
                      <td>
                        <FaArrowCircleRight
                          className={`icono ${salaSeleccionada === sala ? 'seleccionado' : ''}`} 
                          onClick={() => handleSelectSala(sala)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>  
      </div>
        
      <div className="details-section">
        <div className="details-section-table">
          {salaSeleccionada && (
            <table>
              <thead>
                <tr>
                  <th colSpan={8}><h2>{`Sala ${salaSeleccionada.Nombre_sala}`}</h2></th>
                </tr>
                {renderCabeceraTabla()}
              </thead>
              <tbody>
                {renderFilasTabla()}
              </tbody>
            </table>
          )}
        </div>
      </div> 
    </>
  );
}

export default VerDisponibilidadSalas;
