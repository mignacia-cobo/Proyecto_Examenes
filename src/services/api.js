import axios from 'axios';

const API_URL = 'http://localhost:3000/api/salas';// Reemplaza con la URL de tu API

//GESSALAS
export const fetchSalasConfirmadas = async () => {
  try {
    const response = await axios.get(`${API_URL}/salasConfirmadas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las salas confirmadas:', error);
    throw error;
  }
};

export const guardarSala = async (sala) => {
  try {
    const response = await axios.post(`${API_URL}/guardarSala`, sala);
    return response.data;
  } catch (error) {
    console.error('Error al confirmar la sala:', error);
    throw error;
  }
};

export const eliminarSalasConfirmadas = async (salaId) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminarSalaConfirmada/${salaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la sala confirmada:', error);
    throw error;
  }
};

//OBTENER SALA
export const fetchSalaFromAPI = async (ID_Sala) => {
  try {
    const salaResponse = await axios.get(`${API_URL}/id/${ID_Sala}`);
    return salaResponse.data;
  } catch (error) {
    console.error('Error al obtener los datos de la sala:', error);
    throw error;
  }
};

// ACTUALIZAR SALA
export const updateSalaInAPI = async (ID_Sala, salaData) => {
  try {
    const response = await axios.put(`${API_URL}/up/${ID_Sala}`, salaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la sala:', error);
    throw error;
  }
};

// ELIMINAR SALA
export const deleteSalaInAPI = async (ID_Sala) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminarSala/${ID_Sala}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
      console.error('Error al eliminar la sala API:', error.message);
    throw error;
  }
};