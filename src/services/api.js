import axios from 'axios';

const API_URL = 'http://localhost:3000/api';// Reemplaza con la URL de la API

//GESSALAS
export const fetchSalasConfirmadas = async () => {
  try {
    const response = await axios.get(`${API_URL}/salas/todo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las salas confirmadas:', error);
    throw error;
  }
};

export const guardarSala = async (sala) => {
  try {
    const response = await axios.post(`${API_URL}/salas`, sala);
    return response.data;
  } catch (error) {
    console.error('Error al confirmar la sala:', error);
    throw error;
  }
};

export const eliminarSalasConfirmadas = async (salaId) => {
  try {
    const response = await axios.delete(`${API_URL}/salas/del/${salaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la sala confirmada:', error);
    throw error;
  }
};

//OBTENER SALA
export const fetchSalaFromAPI = async (ID_Sala) => {
  try {
    const salaResponse = await axios.get(`${API_URL}/salas/id/${ID_Sala}`);
    return salaResponse.data;
  } catch (error) {
    console.error('Error al obtener los datos de la sala:', error);
    throw error;
  }
};

// ACTUALIZAR SALA
export const updateSalaInAPI = async (ID_Sala, salaData) => {
  try {
    const response = await axios.put(`${API_URL}/salas/up/${ID_Sala}`, salaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la sala:', error);
    throw error;
  }
};

// ELIMINAR SALA
export const deleteSalaInAPI = async (ID_Sala) => {
  try {
    console.log(axios.delete(`${API_URL}/salas/del/${ID_Sala}`));
    const response = await axios.delete(`${API_URL}/salas/del/${ID_Sala}`);
    console.log('Response API:', response.data);
    return response.data;
  } catch (error) {
      console.error('Error al eliminar la sala API:', error.message);
    throw error;
  }
};

//MODULOS
export const fetchModulos = async () => {
  try {
    const response = await axios.get(`${API_URL}/modulos/todo`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const guardarModuloAPI = async (modulo) => {
  try {
    const response = await axios.post(`${API_URL}/modulos`, modulo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarModuloAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/modulos/del/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchModuloFromAPI = async (ID_Modulo) => {
  try {
    const moduloResponse = await axios.get(`${API_URL}/modulos/id/${ID_Modulo}`);
    return moduloResponse.data;
  } catch (error) {
    throw error;
  }
};

export const updateModuloInAPI = async (ID_Modulo, moduloData) => {
  try {
    const response = await axios.put(`${API_URL}/modulos/up/${ID_Modulo}`, moduloData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//EDIFICIOS
export const fetchEdicicio = async () => {
  try {
    const response = await axios.get(`${API_URL}/edificio/todo`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//ESTADOS
export const fetchEstados = async () => {
  try {
    const response = await axios.get(`${API_URL}/estados/todo`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//RESERVAS
// Obtener exámenes
export const fetchExamenes = async () => {
  try {
    const response = await axios.get(`${API_URL}/examenes/todo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los exámenes:', error);
    throw error;
  }
};

// Crear reserva
export const crearReserva = async (reserva) => {
  try {
    const response = await axios.post(`${API_URL}/reservas`, reserva);
    return response.data;
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    throw error;
  }
};

// Reservar sala ESTA NO USO 
export const reservarSalaAPI = async (reserva) => {
  try {
    const response = await axios.post(`${API_URL}/reservas`, reserva);
    return response.data;
  } catch (error) {
    console.error('Error al reservar la sala:', error);
    throw error;
  }
};

// Obtener reservas por fecha
export const fetchReservasPorFecha = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/reservas/fecha/${fecha}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas por fecha:', error);
    throw error;
  }
};

// Función para obtener todas las reservas
export const fetchReservas = async () => {
  try {
    const response = await axios.get(`${API_URL}/reservas/todo`);
    return response.data; // Retorna los datos de las reservas al cliente
  } catch (error) {
    console.error('Error al obtener las reservas desde la API:', error.message);
    throw error;
  }
};

//FUNCION PARA ACTUALIZAR ESTADO DE UNA SALA SELECCIONADA
export const actualizarEstadoSala = async (ID_Sala, ID_Estado) => {
  try {
    console.log('Datos recibidos en el servicio:', ID_Sala, ID_Estado);
    const response = await axios.put(`${API_URL}/salas/estado/${ID_Sala}/${ID_Estado}`);// Realiza la petición PUT a la API
    return response.data.sala; // Devuelve la sala actualizada
  } catch (error) {
    console.error('Error al actualizar el estado de la sala:', error.response?.data || error.message);
    throw new Error(error.response?.data.message || 'Error al actualizar la sala');
  }
};

//CARGA INICIAL
// Subir archivo Excel
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/archivo/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Retorna los datos procesados para previsualización
    return response.data;
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
};

// Confirmar carga de datos procesados
export const confirmUpload = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/archivo/confirmar`, { datos: data });
    return response.data;
  } catch (error) {
    console.error('Error al confirmar la carga de datos:', error);
    throw error;
  }
};