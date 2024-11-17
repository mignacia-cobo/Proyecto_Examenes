import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerSalaPorId, actualizarSala } from '../../api/api'; // Asegúrate de que la ruta sea correcta

function EditarSala() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sala, setSala] = useState({
    codigo: '',
    nombre: '',
    capacidad: '',
    edificio: ''
  });

  useEffect(() => {
    const fetchSala = async () => {
      const salaData = await obtenerSalaPorId(id);
      console.log('Datos de la sala obtenidos:', salaData); 
      setSala(salaData);
    };
    fetchSala();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actualizarSala(id, sala);
    navigate('/GesSalas'); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={sala.codigo}
        onChange={(e) => setSala({ ...sala, codigo: e.target.value })}
        placeholder="Código"
      />
      <input
        type="text"
        value={sala.nombre}
        onChange={(e) => setSala({ ...sala, nombre: e.target.value })}
        placeholder="Nombre"
      />
      <input
        type="number"
        value={sala.capacidad}
        onChange={(e) => setSala({ ...sala, capacidad: e.target.value })}
        placeholder="Capacidad"
      />
      <input
        type="text"
        value={sala.edificio}
        onChange={(e) => setSala({ ...sala, edificio: e.target.value })}
        placeholder="Edificio"
      />
      <button type="submit">Actualizar Sala</button>
    </form>
  );
}

export default EditarSala;
