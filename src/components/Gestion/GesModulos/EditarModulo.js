import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Importa el ícono de react-icons
import { fetchModuloFromAPI,updateModuloInAPI, fetchEstados} from '../../../services/api';


function EditarModulo() {

  const { id } = useParams();
  const id_mod = parseInt(id);
  const navigate = useNavigate();
  const [estados, setEstados] = useState([]);
  const [modulo, setModulo] = useState({
    Numero: 0,
    Hora_inicio: '00:00',
    Hora_final: '00:00',
    ID_Estado: '',
  });

  //SE OBTIENE EL MODULO PARA MOSTRARLO EN EL FORMULARIO
  useEffect(() => {
    const getModulo = async () => {
      try {
        const response = await fetchModuloFromAPI(id_mod);
        setModulo(response);
        console.log('datos del Módulo',response);
      } catch (error) {
        console.error('Error al obtener los datos del módulo aqui:', error);
        
      }
    };
 

    const getEstados = async () => {
      try {
        const response = await fetchEstados(); // Asume que esta API devuelve todos los estados disponibles
        console.log('Estados:', response);
        const filteredEstados = response.filter((estado) =>
          [0, 1].includes(estado.ID_Estado)
        ); // Filtra solo los estados 0 y 1
        console.log('Estados filtrados:', filteredEstados);
        setEstados(filteredEstados);
      } catch (error) {
        console.error('Error al cargar los estados:', error);
      }
    };

    getModulo();
    getEstados();
  }, [id_mod]);




  //ACTUALIZAR SALA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que la hora de inicio sea menor que la hora de fin
      if (modulo.hora_inicio >= modulo.hora_final) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return;
      }

      await updateModuloInAPI(id_mod, modulo);
      navigate('/Gestion/Modulos');
    } catch (error) {
      console.error('Error al actualizar modulo:', error);
    }
  };

  return (
    <div class="content-container-editar">
      <FaTimes className="exit-icon" onClick={() => navigate('/Gestion/Modulos')} /> {/* Ícono de salida */}
      <form className="editar-sala-form" onSubmit={handleSubmit}>
        <input
          type="number"
          value={modulo.Numero}
          onChange={(e) => setModulo({ ...modulo, Numero: e.target.value })}
          placeholder="Número"
        />
        <input
          type="time"
          value={modulo.Hora_inicio}
          onChange={(e) => setModulo({ ...modulo, Hora_inicio: e.target.value })}
          placeholder="Hora Inicio"
        />
        <input
          type="time"
          value={modulo.Hora_final}
          onChange={(e) => setModulo({ ...modulo, Hora_final: e.target.value })}
          placeholder="Hora Final"
        />
        <select
            value={modulo.ID_Estado}
            onChange={(e) => setModulo({ ...modulo, ID_Estado: parseInt(e.target.value) })}
          >
            {estados.map((estado) => (
              <option 
                key={estado.ID_Estado}
                value={estado.ID_Estado}>
                {estado.Nombre} {/* Mostrar "Activo" o "Inactivo" */}
              </option>
            ))}
          </select>
        <button type="submit">Actualizar Módulo</button>
      </form>
    </div>
  );
}

export default EditarModulo;
