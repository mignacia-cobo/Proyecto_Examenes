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
    const response = await axios.delete(`${API_URL}/salas/${salaId}`);
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
    console.log(axios.delete(`${API_URL}/salas/${ID_Sala}`));
    const response = await axios.delete(`${API_URL}/salas/${ID_Sala}`);
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
    const response = await axios.delete(`${API_URL}/modulos/${id}`);
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
//MODULOS
export const fetchEdicicio = async () => {
  try {
    const response = await axios.get(`${API_URL}/edificio/todo`);
    return response.data;
  } catch (error) {
    throw error;
  }
};