import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Importa el ícono de react-icons
import { fetchSalaFromAPI,updateSalaInAPI,fetchEdicicio } from '../../../services/api';


function EditarSala() {

  const { id } = useParams();
  const ID_Sala = parseInt(id);
  const navigate = useNavigate();
  const [edificios, setEdificios] = useState([]);
  const [sala, setSala] = useState({
    ID_Sala: '',
    Codigo_sala: '',
    Nombre_sala: '',
    Capacidad: '',
    Edificio_ID: '',
    Estado: 1,
  });

  //OBTENER EDIFICIOS
  useEffect(() => {
    // Obtener los datos desde el servidor
    const getEdificios = async () => {
      try {
        const result = await fetchEdicicio();
        console.log(result);
        setEdificios(result);
      } catch (error) {
        console.error('Error al obtener las salas:', error);
      }
    };
    getEdificios();
  }, []);
  // Manejar el cambio de selección del edificio
  const handleEdificioChange = (event) => {
    setSala({ ...sala, ID_Edificio: event.target.value });
  };

  //SE OBTIENE LA SALA A EDITAR PARA MOSTRARLA EN EL FORMULARIO
  useEffect(() => {
    const getSala = async () => {
      try {
        const response = await fetchSalaFromAPI(id);
        setSala(response);
        console.log('datos de la sala',response);
      } catch (error) {
        console.error('Error al obtener los datos de la sala aqui:', error);
        
      }
    };
    getSala();
  }, [id]);


  //ACTUALIZAR SALA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSalaInAPI(ID_Sala, sala);
      navigate('/Gestion/Salas');
    } catch (error) {
      console.error('Error al actualizar la sala:', error);
    }
  };

  return (
    <div class="content-container-editar">
      <FaTimes className="exit-icon" onClick={() => navigate('/Gestion/Salas')} /> {/* Ícono de salida */}
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
        <select
              value={sala.ID_Edificio}
              placeholder='Edificio'
              onChange={handleEdificioChange}>
              <option value="">Seleccione un edificio</option>
                {edificios.map(edificio => (
                  <option key={edificio.ID_Edificio} value={edificio.ID_Edificio}>
                    {edificio.Nombre_Edificio}
                  </option>
          ))}
        </select>
        <button type="submit">Actualizar Sala</button>
      </form>
    </div>
  );
}

export default EditarSala;
