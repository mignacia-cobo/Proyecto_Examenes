import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Importa el ícono de react-icons
import { fetchModuloFromAPI,updateModuloInAPI } from '../../../services/api';


function EditarModulo() {

  const { id } = useParams();
  const id_mod = parseInt(id);
  const navigate = useNavigate();
  const [modulo, setModulo] = useState({
    numero: 0,
    hora_inicio: '00:00',
    hora_final: '00:00',
    estado: true,
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
    getModulo();
  }, [id_mod]);


  //ACTUALIZAR SALA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
          value={modulo.numero}
          onChange={(e) => setModulo({ ...modulo, numero: e.target.value })}
          placeholder="Número"
        />
        <input
          type="time"
          value={modulo.hora_inicio}
          onChange={(e) => setModulo({ ...modulo, hora_inicio: e.target.value })}
          placeholder="Hora Inicio"
        />
        <input
          type="time"
          value={modulo.hora_final}
          onChange={(e) => setModulo({ ...modulo, hora_final: e.target.value })}
          placeholder="Hora Final"
        />
        <input
          type="boolean"
          value={modulo.estado}
          onChange={(e) => setModulo({ ...modulo, estado: e.target.value })}
          placeholder="Estado"
        />
        <button type="submit">Actualizar Módulo</button>
      </form>
    </div>
  );
}

export default EditarModulo;
