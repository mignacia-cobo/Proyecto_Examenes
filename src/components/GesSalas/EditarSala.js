import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Importa el ícono de react-icons
import axios from 'axios';
import { fetchSalaFromAPI,updateSalaInAPI } from '../../services/api';


function EditarSala() {

  const { id } = useParams();
  const ID_Sala = parseInt(id);
  const navigate = useNavigate();
  const [sala, setSala] = useState({
    ID_Sala: '',
    Codigo_sala: '',
    Nombre_sala: '',
    Capacidad: '',
    Edificio_ID: '',
    Estado: true,
  });

  //SE OBTIENE LA SALA A EDITAR PARA MOSTRARLA EN EL FORMULARIO
  useEffect(() => {
    const getSala = async () => {
      try {
        const response = await fetchSalaFromAPI(ID_Sala);
        setSala(response);
        console.log('datos de la sala',response);
      } catch (error) {
        console.error('Error al obtener los datos de la sala aqui:', error);
        
      }
    };
    getSala();
  }, [ID_Sala]);


  //ACTUALIZAR SALA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSalaInAPI(ID_Sala, sala);
      navigate('/GesSalas');
    } catch (error) {
      console.error('Error al actualizar la sala:', error);
    }
  };

  return (
    <div class="content-container-editar">
      <FaTimes className="exit-icon" onClick={() => navigate('/GesSalas')} /> {/* Ícono de salida */}
      <form className="editar-sala-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={sala.Codigo_sala}
          onChange={(e) => setSala({ ...sala, Codigo_sala: e.target.value })}
          placeholder="Código"
        />
        <input
          type="text"
          value={sala.Nombre_sala}
          onChange={(e) => setSala({ ...sala, Nombre_sala: e.target.value })}
          placeholder="Nombre"
        />
        <input
          type="number"
          value={sala.Capacidad}
          onChange={(e) => setSala({ ...sala, Capacidad: e.target.value })}
          placeholder="Capacidad"
        />
        <input
          type="text"
          value={sala.Edificio_ID}
          onChange={(e) => setSala({ ...sala, Edificio_ID: e.target.value })}
          placeholder="Edificio"
        />
        <button type="submit">Actualizar Sala</button>
      </form>
    </div>
  );
}

export default EditarSala;
