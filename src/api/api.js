export const obtenerSalaPorId = async (id) => {
    const response = await fetch(`/api/salas/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la sala');
    }
    const data = await response.json();
    return data;
  };
  
  export const actualizarSala = async (id, sala) => {
    const response = await fetch(`/api/salas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sala),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la sala');
    }
  };